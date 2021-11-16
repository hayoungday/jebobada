# 배포 시 유의 사항 
#   - 메타데이터 조합 파일 경로 설정
#
# 사용법 :
#     (1) 인스턴스 생성
#     (2) setFilePath 함수로 대상 파일 설정
#     (3) 인스턴스에서 원하는 함수 바로 call
#
# 설명 : 
#     metadata를 사용해 편집 여부를 판별
# 
# 탐지 가능 프로그램 : 
#     Adobe After Effects, Adobe Premier, DaVinci Resolve, Audacity, OcenAudio, WavePad
# 
# 구현 :
#     1. 스마트폰 기본 녹음 어플 : m4a
#         - 생성 시각 수정 시각이 다른지 확인      
#         - 편집 관련 필드가 없는지
#             - (어도비 프리미어)XMP 관련 필드가 없는지 : ex) History Software Agent
#     2. 녹음 시각이 기록되지 않는 다른 포맷 ex) mp3, wav 
#         - 편집 관련 필드가 없는지
#             - Adobe After Effects
#                 - 필드명 : XMP Toolkit - 어도비 XMP 버전
#             - Adobe Premier
#                 - 필드명 : XMP 관련 필드
#                 - 필드명 : History Software Agent - 어도비 프리미어랑 버전 정보
#             - DaVinci Resolve
#                 - 필드명 : originator, Software Version, Application Platform, Application Name, Application Version String
#                 - wav
#                     - originator : DaVinci Resolve
#                 - mov
#                     - Software Version : Blackmagic Design DaVinci Resolve
#                 - mxf 
#                     - Application Platform : DaVinci Resolve
#                     - Application Name : DaVinci Resolve          <- 이걸로 판단
#                     - Application Version String : 17.3.2
#             - audacity **
#                 - mp3의 경우 encoder 필드가 생김
#             - ocenaudio **
#                 - m4a의 경우만
#                 - 필드명 : iTunSMPB
#             - WavePad
#                 - 필드명 : Encoded By
#      
#      
# 추가 기능 2021-10-28
# (1) 갤럭시, 아이폰 기본 어플로 녹음이 됐는지 확인 기능
#   - 기본 어플 메타데이터 필드가 그대로 나오는지, 특수 값들이 제대로 나오는지 등을 확인
# (2) 편집 결과에 대한 근거를 제시하는 기능
#   - 편집프로그램 관련 메타데이터 필드명 제시
# (3) 유명한 녹음어플들의 메타데이터를 분석해 편집 전 메타데이터 상태로 원본 보존 여부를 판단하는 기능
#   - 안드로이드 어플명
#       삼성 음성 녹음(Samsung Eletronics Co., LTd.) - 4.3 / 10억회 이상
#       녹음기(Smart Mobi Tools) - 4.7 / 1000만회 이상
#       녹음기(recorder & smart apps) - 4.7 / 1000만회 이상
#       음성녹음 플러스(Digitalchemy, LLC) - 4.7 / 50만회 이상
#       음성 녹음기 및 음성 메모(Dairy App & Notes & audio Editor & Voice Recorder) - 4.7 / 500만회 이상
#       클로바노트 - 4.8 / 50만회 이상
#       음성 녹음기(Raytechnoto) - 4.5 / 100만회 이상
#       곰녹음기(GOM & Company) - 4.5 / 10만회 이상
#       고급 음성 레코더(lovekara) - 4.7 / 1000만회 이상
#       이지 보이스 레코더(Digipom) - 4.7 / 5000만회 이상
#       음성 녹음(HappyBees&Screen Voice Recorder&Video Music Editor) - 4.7 / 100만회 이상
#   - iOS 어플명
#       음성 메모 : 애플
#       녹음 - 간편한 녹음기 : 5천, OneStep Inc.	- 녹음기
#       녹음기 - 녹음 : 2천, Linfei Recorder 		- 녹음기빨
#       어썸 보이스 레코더 - AVR : 1.7천, Newkline Co., Ltd. - avr
#       녹음기 - 녹음 & 통화녹음 : 7.5천, 중국 회사 - voicerecorder
#       쉬운컷 - (오디오 클립) : 3.6천, 중국 회사 - easycut
#   - 녹음기
#       Buzzlight
# (4) 캡쳐 이미지의 메타데이터를 분석해 편집 전 메타데이터 상태로 이미지 원본 여부를 판단하는 기능
#   - 
#
#
# 추후 개발
#   각 녹음 어플이 '다른 이름으로 저장' 기능이 있는지

from metaExiftool import metaExiftool
from datetime import datetime
import json
import re

zeroField = ["0 s", "0", "None", "  ", ""]

class detectEdition : 
    def __init__(self, filePath=None) :
        # 메타데이터 추출을 위한 metaExiftool 모듈 사용
        self.__metaModule = metaExiftool()
        self.__fullMetaJsonData = None
        self.__fullKeyFields = None
        self.__filePath = None
        self.__recordAppMetaFieldPath = "./recordAppMetaField.json" # 환경 변수로 관리??
        self.__phoneCaptureMetaFieldPath = "./phoneCaptureMetaField.json" # 환경 변수로 관리??
        self.__imageEditorMetaFieldPath  = './imageEditorMetaField.json' 
        if filePath : 
            self.__fullMetaJsonData = self.__metaModule.getFullTags(filePath)
            self.__fullKeyFields = self.__fullMetaJsonData.keys()
            self.__filePath = filePath


    def __del__(self) : 
        pass
    

    def setFilePath(self, filePath) : 
        # 전역변수에 filePath 파일의 메타데이터를 json 타입으로 저장
        self.__fullMetaJsonData = self.__metaModule.getFullTags(filePath)
        self.__fullKeyFields = self.__fullMetaJsonData.keys()
        self.__filePath = filePath

    def __secGapBetweenTime(self, strCTimeField, strMTimeField) : 
        # 기능 : 시간 필드명에 해당하는 시간 간의 초(sec) 차이 계산
        # 파라미터 : exiftool에 나오는 시간 필드명 
        # return : 초(sec) 차이
        fileMTime = self.__fullMetaJsonData[strMTimeField]
        cTime = self.__fullMetaJsonData[strCTimeField]

        default = re.compile('\\d{4}:\\d{2}:\\d{2}\\s\\d{2}:\\d{2}:\\d{2}')
        pluspoint = re.compile('\\d{4}:\\d{2}:\\d{2}\\s\\d{2}:\\d{2}:\\d{2}[.]\\d{1,}')
        plusUTC = re.compile('\\d{4}:\\d{2}:\\d{2}\\s\\d{2}:\\d{2}:\\d{2}[+]\\d{2}:\\d{2}')
        plusZ = re.compile('\\d{4}:\\d{2}:\\d{2}\\s\\d{2}:\\d{2}:\\d{2}[Z]')
  

        if cTime == '0000:00:00 00:00:00' : 
            return 0
        elif plusUTC.match(cTime) :
            cTime = datetime.strptime(cTime, "%Y:%m:%d %H:%M:%S+09:00")
        elif plusZ.match(cTime) :
            cTime = datetime.strptime(cTime, "%Y:%m:%d %H:%M:%SZ")
        elif pluspoint.match(cTime) : 
            cTime = datetime.strptime(cTime, "%Y:%m:%d %H:%M:%S.%f")
        elif default.match(cTime) : 
            cTime = datetime.strptime(cTime, "%Y:%m:%d %H:%M:%S")
        
        if fileMTime == '0000:00:00 00:00:00' : 
            return 0
        elif plusUTC.match(fileMTime) :
            fileMTime = datetime.strptime(fileMTime, "%Y:%m:%d %H:%M:%S+09:00")
        elif plusZ.match(fileMTime) :
            fileMTime = datetime.strptime(fileMTime, "%Y:%m:%d %H:%M:%SZ")
        elif pluspoint.match(fileMTime) : 
            fileMTime = datetime.strptime(fileMTime, "%Y:%m:%d %H:%M:%S.%f")
        elif default.match(fileMTime) : 
            fileMTime = datetime.strptime(fileMTime, "%Y:%m:%d %H:%M:%S")

        return (cTime-fileMTime).total_seconds()


    def __diffCMTwithFN(self, strCTimeField, strMTimeField, secCritic=10) : 
        # 기능 : 필드명에 해당하는 시간 값 차이가 허용범위 내인지 아닌지 판단 
        #   - 
        # 파라미터 : 시간에 해당하는 exiftool 필드 명 
        if strCTimeField in self.__fullKeyFields and strMTimeField in self.__fullKeyFields :  
            secGap = self.__secGapBetweenTime(strCTimeField, strMTimeField)       
            if abs(secGap) < secCritic: 
                return 0 
            else :
                return secGap 
        else : 
            None


    def isEdittedCMTime(self) : 
        # 파일의 modified 시간, 생성 시간을 비교해서 편집 여부를 검증
        # return 값
        #   편집 의심 O : True 
        #   편집 의심 X : False 
        if self.__fullMetaJsonData == None : 
            print("Set the filePath with setFilePath!")
            return None
        else : 
            if 'Create Date' in self.__fullKeyFields and 'Modify Date' in self.__fullKeyFields : 
                if self.__diffCMTwithFN('Create Date', 'Modify Date') < 0 :
                    return True 
                else : 
                    return False 

            elif 'Media Create Date' in self.__fullKeyFields and 'Media Modify Date' in self.__fullKeyFields : 
                if self.__diffCMTwithFN('Media Create Date', 'Media Modify Date') < 0 :
                    return True 
                else : 
                    return False 

            elif  'Create Date' in self.__fullKeyFields and 'File Modification Date/Time' in self.__fullKeyFields : 
                if self.__diffCMTwithFN('Create Date', 'File Modification Date/Time') < 0 :
                    return True 
                else : 
                    return False 
                
            else : 
                print("no create Date")
                return None
    
    def isEdittedField(self) :
        # 파일 메타데이터 필드로 편집 프로그램 관련 필드가 있는지를 확인하여 편집 여부를 검증
        # return 값
        #   편집 의심 O : 편집 의심 프로그램 명 list    ex) ['Adobe Premier', 'WavPad'] 
        #   편집 의심 X : None
        isEditted = 0 
        if self.__fullMetaJsonData == None : 
            print("Set the filePath with setFilePath!")
            return None
        else : 
            lReturnPrograms = []
            keyFields = self.__fullKeyFields
            fileTypeExt = self.__fullMetaJsonData['File Type Extension']

            # Adobe Premiere
            if 'History Software Agent' in keyFields and 'Adobe' in self.__fullMetaJsonData['History Software Agent'] :
                lReturnPrograms.append(self.__fullMetaJsonData['History Software Agent'])
                isEditted += 1                 

            # Adobe After Effects, Davinci Resolve
            if 'Originator' in keyFields : 
                # Adobe AE, Davinci : .wav
                lReturnPrograms.append(self.__fullMetaJsonData['Originator'])
                isEditted += 1 
            else : 
                # Adobe AE : .mp3 
                if 'XMP Toolkit' in keyFields and 'Adobe' in self.__fullMetaJsonData['XMP Toolkit'] : 
                    lReturnPrograms.append('Adobe After Effects')
                    isEditted += 1 
                # Davinci : .mov 
                elif 'Software Version' in keyFields and 'DaVinci' in self.__fullMetaJsonData['Software Version'] : 
                    lReturnPrograms.append('Software Version')
                    isEditted += 1 
                # Davinci : .mxf
                elif 'Application Name' in keyFields and 'DaVinci' in self.__fullMetaJsonData['Application Name'] : 
                    lReturnPrograms.append(self.__fullMetaJsonData['Application Name'])
                    isEditted += 1 

            # Audacity
            if fileTypeExt == 'mp3' and 'encoder' in keyFields : 
                lReturnPrograms.append('Audacity')
                isEditted += 1 
            
            # OcenAudio
            if (fileTypeExt == 'mp4' or fileTypeExt == 'm4a') and 'iTunSMPB' in keyFields : 
                lReturnPrograms.append('OcenAudio') 
                isEditted += 1 

            # Wavepad
            if 'Encoded By' in keyFields and 'WavePad' in self.__fullMetaJsonData['Encoded By'] : 
                lReturnPrograms.append(self.__fullMetaJsonData['Encoded By']) 
                isEditted += 1 

            # return name of suspicious programs
            if isEditted : 
                return lReturnPrograms
            else : 
                return None

    def isOriginalGalaxyRecorder(self) : 
        galaxyMetaField = ['ExifTool Version Number', 
                            'File Name', 
                            'Directory', 
                            'File Size', 
                            'File Modification Date/Time', 
                            'File Access Date/Time', 
                            'File Creation Date/Time', 
                            'File Permissions', 
                            'File Type', 
                            'File Type Extension', 
                            'MIME Type', 
                            'Major Brand', 
                            'Minor Version', 
                            'Compatible Brands', 
                            'Media Data Size', 
                            'Media Data Offset', 
                            'Movie Header Version', 
                            'Create Date', 
                            'Modify Date', 
                            'Time Scale', 
                            'Duration', 
                            'Preferred Rate', 
                            'Preferred Volume', 
                            'Preview Time', 
                            'Preview Duration', 
                            'Poster Time', 
                            'Selection Time', 
                            'Selection Duration', 
                            'Current Time', 
                            'Next Track ID', 
                            'Play Mode', 
                            'Android Version', 
                            'Track Header Version', 
                            'Track Create Date', 
                            'Track Modify Date', 
                            'Track ID', 
                            'Track Duration', 
                            'Track Layer', 
                            'Track Volume', 
                            'Matrix Structure', 
                            'Media Header Version', 
                            'Media Create Date', 
                            'Media Modify Date', 
                            'Media Time Scale', 
                            'Media Duration', 
                            'Handler Type', 
                            'Handler Description', 
                            'Balance', 
                            'Audio Format', 
                            'Audio Channels', 
                            'Audio Bits Per Sample', 
                            'Audio Sample Rate', 
                            'Avg Bitrate']

        if set(self.__fullKeyFields) != set(galaxyMetaField) : 
            return False
        else : 
            if self.__fullMetaJsonData["Major Brand"] == "3GPP Media (.3GP) Release 4" :
                return True
            else : 
                return False 

    
    def isOriginalAppleRecorder(self) : 
        iPhoneMetaField = ['ExifTool Version Number', 
                            'File Name', 
                            'Directory', 
                            'File Size', 
                            'File Modification Date/Time', 
                            'File Access Date/Time', 
                            'File Creation Date/Time', 
                            'File Permissions', 
                            'File Type', 
                            'File Type Extension', 
                            'MIME Type', 
                            'Major Brand', 
                            'Minor Version', 
                            'Compatible Brands', 
                            'Media Data Size', 
                            'Media Data Offset', 
                            'Movie Header Version', 
                            'Create Date', 
                            'Modify Date', 
                            'Time Scale', 
                            'Duration', 
                            'Preferred Rate', 
                            'Preferred Volume', 
                            'Preview Time', 
                            'Preview Duration',
                            'Poster Time', 
                            'Selection Time', 
                            'Selection Duration',
                            'Current Time', 
                            'Next Track ID', 
                            'Track Header Version', 
                            'Track Create Date', 
                            'Track Modify Date', 
                            'Track ID', 
                            'Track Duration', 
                            'Track Layer', 
                            'Track Volume', 
                            'Matrix Structure',
                            'Media Header Version', 
                            'Media Create Date', 
                            'Media Modify Date', 
                            'Media Time Scale', 
                            'Media Duration', 
                            'Media Language Code', 
                            'Handler Description', 
                            'Balance', 
                            'Audio Format', 
                            'Audio Channels', 
                            'Audio Bits Per Sample', 
                            'Audio Sample Rate', 
                            'Date/Time Original', 
                            'Handler Type', 
                            'Title', 
                            'voice-memo-uuid', 
                            'Encoder', 
                            'Avg Bitrate']

        if set(self.__fullKeyFields) != set(iPhoneMetaField) : 
            return False
        else : 
            if self.__fullMetaJsonData["Major Brand"] == "Apple iTunes AAC-LC (.M4A) Audio" and 'com.apple.VoiceMemos' in self.__fullMetaJsonData['Encoder'] :
                return True
            else : 
                return False 

    def __matchWithMetaCombi(self,ext, fileFullFields, recordAppMetadata) : 
        # json 파일로 저장한 메타데이터 조합들 중 일치하는 것이 있는지 확인
        for programName in recordAppMetadata.keys() : 
            # (1) 파일의 메타데이터 필드명을 확인해 정확히 일치하는 것이 있는지 확인
            if ext in recordAppMetadata[programName] :
                normalFields = set(recordAppMetadata[programName][ext]["fields"])
                if fileFullFields == normalFields : 
                # (2) null이 아니여야 하는 필드가 실제로 null이 아닌지
                    notEmptyFields = recordAppMetadata[programName][ext]["notEmptyField"]
                    for field in notEmptyFields : 
                        if self.__fullMetaJsonData[field] in zeroField : 
                            return None 
                    return programName 
            else : 
                continue
        return None

    def __relatedField(self, programName, ext) : 
        lReturnStrs = []
        if "Adobe After Effects" in programName: 
            lReturnStrs.append("XMP Toolkit")
        elif "Adobe Premier" in programName: 
            lReturnStrs.append("History Software Agent")
        elif "DaVinci Resolve" in programName: 
            if ext == 'wav' :
                lReturnStrs.append("originator")
            if ext == 'mov' :
                lReturnStrs.append("Software Version")
            if ext == 'mxf' :
                lReturnStrs.append("Application Name")
        elif "Audacity" in programName and ext == 'mp3': 
            lReturnStrs.append("encoder")
        elif "OcenAudio" in programName and (ext == 'mp4' or ext == 'm4a'): 
            lReturnStrs.append("iTunSMPB")
        elif "WavePad" in programName : 
            lReturnStrs.append("Encoded By")
            
        return lReturnStrs

    def isEditted(self) : 
        # 편집된 음성파일인지 판단해줌
        # 반환값 : 편집되었으면 True, 아니면 False 
        # 로직 : 
        #   (1) 생성 수정시간 비교
        #   (2) 유명한 편집 프로그램의 메타데이터가 남았는지 확인
        if self.__fullMetaJsonData == None : 
            print("Set the filePath with setFilePath!")
            return None
        else : 
            returnDict = {}
            returnDict['isEditted'] = False
            returnDict['reason'] = ''
            returnDict['programNames'] = ''
            returnDict['relatedMetadataFields'] = ''
            editcheckField = self.isEdittedField()
            # (1) 생성 수정시간 비교
            if self.isEdittedCMTime() : 
                returnDict['isEditted'] = True
                returnDict['reason'] = 'cmt'
            # (2) 유명한 편집 프로그램의 메타데이터가 남았는지 확인
            if editcheckField :
                evidenceFields = []
                for programName in editcheckField :
                    evidenceFields.append(self.__relatedField(programName, self.__fullMetaJsonData["File Type Extension"]))
                returnDict['isEditted'] = True
                returnDict['reason'] = 'meta'
                returnDict['programNames'] = editcheckField
                returnDict['relatedMetadataFields'] = evidenceFields
            return returnDict
    


    def useFamousRecorderApp(self) : 
        # 녹음 파일이 유명한 녹음 어플로 생성된 것인지 판단
        # 로직 
        #    (1) 파일 메타데이터 필드명이 유명한 어플로 녹음한 파일의 메타데이터 필드명과 일치하는지 확인
        #    (2) 프로그램 생성 파일이라면 null, 0 등의 값을 갖지 않는 메타데이터 필드명이 실제 값으로 채워져있는지 확인  
        # 결과 + 이유
        # 테스트 많이 해보기
        # 옛날 버전 찾아보고 일관된 메타데이터 필드는 뭐가 있는지 확인
        #   - 변하지 않는 고유한 메타데이터 찾기 

        ext = (self.__filePath.split('.')[-1]).lower()
        with open(self.__recordAppMetaFieldPath, 'r') as f :          # 이거 환경변수로 해야될 듯?
            recordAppMetadata = json.load(f) # json data
        fileFullFields = set(self.__fullKeyFields)

        return self.__matchWithMetaCombi(ext, fileFullFields, recordAppMetadata)
    
    def useImageEditor(self) :

        ext = (self.__filePath.split('.')[-1]).lower()
        with open(self.__imageEditorMetaFieldPath, 'r') as f :          # 이거 환경변수로 해야될 듯?
            imageEditorMetadata = json.load(f) # json data
        fileFullFields = set(self.__fullKeyFields)

        # None이거나 프로그램 이름이거나 
        return self.__matchWithMetaCombi(ext, fileFullFields, imageEditorMetadata)


