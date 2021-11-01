# 설명 : 
# - exiftool을 사용해 이미지와 음성파일의 메타데이터를 얻음
# - 위치정보가 타당한지 확인
#   - 공간정보 오픈플랫폼 오픈 API 중 검색 API 2.0 활용
#
#
# 사용법 : 
#   - getDefaultTags(이미지 경로) : 이미지에서 필요한 메타 데이터만 dict으로 뽑아줌
#
#
# 메타데이터 :
# - 파일 이름 
# - 파일 포멧 
# - 파일 용량 
# - 재생 시간 
# - 음성 파일 생성 
# - ios 전용
#   - 위치정보(title)
#   - 녹음 기기(encoder)
#
#
# 이미지 제약 사항
# - 지원 포맷 : JPEG, PNG8, PNG24, GIF, 애니메이션 GIF(첫 번째 프레임만), BMP, WEBP, RAW, ICO, PDF, TIFF
# - 파일 사이즈
#     - 권장되는 최소 이미지 크기 : 640 x 480 픽셀(약 300k 픽셀)
#     - 권장되는 크기 : 1024 x 768
# - 최대 파일 크기 : 4MB
# - 분당 텍스트 인식 request가 1800회로 제한(request 당 최대 16개 이미지까지 가능)
#
# 공간정보 오픈플랫폼 오픈 API(검색 API 2.0)
# 인증키 : 2029211D-6C89-354A-B0C8-815545A8D9E0
# 등록 URL : http://www.jebobada.com


import requests
import subprocess
import os


class metaExiftool :
    def __init__(self) :
        # 공간정보 오픈플랫폼 오픈 API 인증키
        # 검색 API 2.0  

        # 테스트 환경에서는 하드코딩으로 테스트
        # 실제 구현에서는 api 인증키를 VWORLD_API_AUTH_KEY 환경변수에 저장 하여 사용할 것
        # 해당 환경변수가 없으면 None 
        # config.py의 전역변수를 가져옴 VWORLD_API_AUTH_KEY = os.environ.get('VWORLD_API_AUTH_KEY')
        # self.authKey = config.VWORLD_API_AUTH_KEY  
        self.authKey = "2029211D-6C89-354A-B0C8-815545A8D9E0" # 서버에서는 삭제

    def __del__(self) : 
        pass

    def getExt(self, filePath) : 
        # 파일의 확장자를 str로 리턴 ex) '.mp3', '.m4a' 등
        return os.path.splitext(filePath)[1].lower()
    
    def getAsLines(self, meta) : 
        # exiftool 출력값을 line 별로 파싱
        try : 
            lines = meta.decode('euc-kr').split("\n")
        except : 
            try : 
                lines = meta.decode('utf8').split("\n")
            except : 
                lines = meta.decode('latin_1').split("\n")
        return lines

    def getMeta(self, filepath) : 
        # 터미널로 exiftool 실행 : 자식프로세스로 실행
        # exiftool 툴 출력값(str)을 그대로 반환

        cmd = "curl -s %s | exiftool -" %filepath
        output = subprocess.check_output(cmd, shell=True)
        
        # with open(filepath, 'rb') as f : 
        return output
    
    def getKeyValueFromLine(self,line) : 
        # line을 : 로 split해 앞의 값을 key, 뒤의 값을 value로 반환
        # ex) 
        #   File Name                       : taunt.wav
        #   =>  key = 'File Name'
        #       value = 'taunt.wav'
        pair = line.split(':',1) 
        key = pair[0].strip()
        value = pair[1].strip()
        return key, value
    
    def getFullTags(self, filepath) :
        # exiftool을 실행하여 모든 메타데이터를 뽑아 dict 형태로 반환
        returnDict = {}
        metaLines = self.getAsLines(self.getMeta(filepath))
        for line in metaLines :
            if line : 
                key, value = self.getKeyValueFromLine(line)
                returnDict[key] = value
        return returnDict


    def getAudioTags(self, filepath):
        # 오디오 file에서 다음 메타정보를 뽑아 dict로 반환
        # return 값
        # - 파일 이름 
        # - 파일 포멧 
        # - 파일 용량 
        # - 재생 시간 
        # - 음성 파일 생성 
        # - 위치정보(title) - ios 전용 
        # - 녹음 기기(voice-memo-uuid) - ios 전용
        # - 녹음 어플(encoder) - ios 전용         
        returnDict = {}
        returnDict['fileName'] = None
        returnDict['title'] = None
        returnDict['fileFormat'] = None
        returnDict['fileSize'] = None
        returnDict['duration'] = None
        # returnDict['fileCtime'] = None
        returnDict['fileMtime'] = None
        returnDict['audioCtime'] = None
        returnDict['title'] = None
        returnDict['voiceMemoUuid'] = None
        returnDict['encoder'] = None
        returnDict['majorBrand'] = None
        
        # exiftool을 실행하고 결과물을 line 별로 파싱 후 list로 저장
        metaLines = self.getAsLines(self.getMeta(filepath))
        
        # 필요한 메타데이터이면 dict에 저장
        for line in metaLines :
            if line : 
                key, value = self.getKeyValueFromLine(line)

                if key == 'File Name' : 
                    returnDict['fileName'] = value
                    continue
                elif key == 'File Type' : 
                    returnDict['fileFormat'] = value
                    continue
                elif key == 'File Size' : 
                    returnDict['fileSize'] = value
                    continue
                elif key == 'Duration' : 
                    returnDict['duration'] = value
                    continue
                # elif key == 'File Creation Date/Time' : 
                #     returnDict['fileCtime'] = value
                #     continue
                elif key == 'File Modification Date/Time' : 
                    returnDict['fileMtime'] = value
                    continue
                elif key == 'Create Date' : 
                    returnDict['audioCtime'] = value
                    continue
                # 밑부분은 ios로 녹음할 경우에만 유의미
                # Title 필드 : 도로명 주소가 기록됨 ex) 가산동
                # Encoder : 사용된 어플
                elif key == 'Title' : 
                    returnDict['title'] = value
                    if not self.isValidAddress(value) : 
                        returnDict['title'] = None
                    continue
                elif key == 'voice-memo-uuid' : 
                    returnDict['voiceMemoUuid'] = value
                    continue
                elif key == 'Encoder' : 
                    returnDict['encoder'] = value
                    continue
                elif key == 'Major Brand' : 
                    returnDict['majorBrand'] = value
                    continue
                    
        return returnDict

    def getImageTags(self, filepath):
        # 오디오 file에서 다음 메타정보를 뽑아 dict로 반환
        # return 값
        # - 파일 이름 
        # - 파일 포멧 
        # - 파일 용량 
        # - 이미지 파일 생성 시간
        # - 위치정보(GPS) - EXIF 있을 경우 
        # - 녹음 기기 및 어플 
        #   - deviceModel, cameraModelName, software, lensID, lensModel, description  
        returnDict = {}
        returnDict['fileName'] = None
        returnDict['fileType'] = None
        returnDict['fileSize'] = None
        # returnDict['fileCtime'] = None
        returnDict['fileMtime'] = None
        returnDict['imageCtime'] = None
        returnDict['gpsPosition'] = None
        returnDict['deviceModel'] = None
        returnDict['cameraModelName'] = None
        returnDict['software'] = None
        returnDict['lensID'] = None
        returnDict['lensModel'] = None
        returnDict['description'] = None

        # exiftool을 실행하고 결과물을 line 별로 파싱 후 list로 저장
        metaLines = self.getAsLines(self.getMeta(filepath))
        
        # 필요한 메타데이터이면 dict에 저장
        for line in metaLines :
            if line : 
                key, value = self.getKeyValueFromLine(line)

                if key == 'File Name' : 
                    returnDict['fileName'] = value
                    continue
                elif key == 'File Type' : 
                    returnDict['fileType'] = value
                    continue
                elif key == 'File Size' : 
                    returnDict['fileSize'] = value
                    continue
                # elif key == 'File Creation Date/Time' : 
                #     returnDict['fileCtime'] = value
                #     continue
                elif key == 'File Modification Date/Time' : 
                    returnDict['fileMtime'] = value
                    continue
                elif key == 'Create Date' : 
                    returnDict['imageCtime'] = value
                    continue
                # 밑부분은 Image Description 정보가 있을 경우에만 유의미
                elif key == 'Make' : 
                    returnDict['make'] = value
                    continue
                elif key == 'Camera Model Name' : 
                    returnDict['cameraModelName'] = value
                    continue
                elif key == 'Software' : 
                    returnDict['software'] = value
                    continue
                elif key == 'Lens Model' : 
                    returnDict['lensModel'] = value
                    continue
                elif key == 'Lens ID' : 
                    returnDict['lensID'] = value
                    continue
                elif key == 'Description' : 
                    returnDict['description'] = value
                    continue
                # 밑부분은 EXIF 정보가 있을 경우에만 유의미
                elif key == 'GPS Position' : 
                    returnDict['gpsPosition'] = value
                    continue
                elif key == 'Device model' : 
                    returnDict['deviceModel'] = value
                    continue
        return returnDict

    def isValidAddress(self, address) : 
        # 공간정보 오픈플랫폼 오픈 API를 사용하여 title에 기록된 값이 우리나라 지역이 맞는지 확인
        # 검색 API 2.0 활용
        #    --리턴값--
        #    OK : 주소가 우리나라에 있음
        #    NOT_FOUND : 주소가 우리나라에 없음
        #    ERROR : 에러 발생 
        flag = False
        url = "http://api.vworld.kr/req/search?service=search&request=search&version=2.0&crs=EPSG:900913&bbox=&size=10&page=1&query={}&type=ROAD&format=json&errorformat=json&key={}".format(address,self.authKey)
        res = requests.get(url).json()
        status = res['response']['status']        
        if status == 'OK' : # 주소가 우리나라에 있을 경우에만 flag가 True
            flag = True 
        return flag


