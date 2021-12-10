# 설명 :
#     카카오톡 캡쳐본이 위변조된 것인지 확인
# 
# 구현 : 
#     1. 대화 입력 칸의 버튼 간 거리 비율
#         버튼 간의 거리 비율로 위변조 판단 : smile과 #의 거리/우측에서 smile까지의 거리 
#           - 정상 : 0.605 ~ 0.609
#           - 썰 조작 어플 : 0.611
#     2. 대화 박스 정렬 여부
#         2.1. 대화 박스 왼쪽 모서리 y값의 일정함 
#         2.2. 대화 박스 간 상하 간격의 일정함 
#
# ***제약 사항 : 
#     1. 기본 테마만 가능
#     2. 기본 배경만 가능



import cv2
import numpy as np
from urllib.request import urlopen

class kakaoForgeryDetect : 
    def __init__(self, imgPath = None) :
        self.__imgCV2 = None
        self.__backgroundColor = np.array((216, 199, 178)) # bgr
        if imgPath : 
            # imgPath에 한글 포함하면 안됨
            # 서버 버전 코드
            # readFlag=cv2.IMREAD_COLOR
            # resp = urlopen(imgPath)
            # image = np.asarray(bytearray(resp.read()), dtype="uint8")
            # self.__imgCV2 = cv2.imdecode(image, readFlag)
            # 로컬 디버깅 코드
            self.__imgCV2 = cv2.imread(imgPath)
        # if chatboxLTimg : 
        #     self.chatboxCV2 = cv2.imread(chatboxLTimg)

    def __del__(self) : 
        pass
    
    def setImgPath(self, imgPath) : 
        # 전역변수에 imgPath 파일을 cv2로 오픈
        self.__imgCV2 = cv2.imread(imgPath)


    def __inArray(self, pointRGB, color, scale = 10) : 
        # pointRGB가 scriptColor array +, - 범위에 포함되는지 여부를 boolean으로 리턴
        retV = True 
        for i,v in enumerate(pointRGB) :
            if (v <= color[i] - scale) or (color[i] + scale <= v) : 
                retV = False
        return retV
             
    

    def __pointRGB(self, x, y) : 
        # 이미지 내 x,y 좌표의 rgb 값을 반환 : (cv2에선 bgr임)
        return self.__imgCV2[y, x , :]


    def __smileSharpRatio(self) : 
        # 버튼의 위치로 위변조 판단 : (우측 측면에서 이모티콘 버튼까지의 거리) / (input box에서의 이모티콘 버튼 높이)
        #   - 정상은 3.9 ~ 4.0
        #   - 썰 주작 어플은 4.48
        imgH = self.__imgCV2.shape[0]
        imgW = self.__imgCV2.shape[1]

        inputBoxFlag = 0
        scriptColor = np.array((155, 148, 145)) # bgr

        findSmile = 0 
        findSharp = 0
        inputboxStartY = imgH
        for lbY in range(imgH-1, int(imgH/2), -1) :
            lbX = 0
            dumpList = [] 

            # recognize input box 
            averageRGB = self.__averageRGBofLine(lbY)
            averageV = np.average(averageRGB)
            if not inputBoxFlag and averageV <= 254 : 
                inputboxStartY = lbY
                continue
            
            inputBoxFlag = 1

            # find the gray scope
            dump = [] 
            dumpStartFlag = 0
            dumpX = 0 
            for lbX in range(int(imgW/2), imgW) :
                # scan X row
                point = (lbX,lbY)
                pointRGB = self.__pointRGB(lbX,lbY)
                
                if self.__inArray(pointRGB, scriptColor) : 
                    if dumpStartFlag : 
                        dumpX += 1 
                    else : 
                        dumpStartFlag = 1
                        dump.append(point)
                        dumpX = lbX
                elif dumpStartFlag :
                    if len(dump) == 1 : 
                        dump.append(dump[0])
                    else : 
                        dump.append(point)                        
                    dumpList.append(dump) 
                    dumpStartFlag = 0
                    dump = [] 
            
            if not findSmile and dumpList: 
                findSmile = 1 
                scope = dumpList[0]
                xSmile = (scope[0][0] + scope[1][0]) / 2

            # 샵(#)의 x값
            if not findSharp and findSmile and len(dumpList) >= 4  :
                findSharp = 1 
                startScope = dumpList[-2]
                endScope = dumpList[-1]
                xSharp = (startScope[0][0] + endScope[1][0]) / 2

            if findSmile and findSharp  : 
                return (imgW-xSmile)/(inputboxStartY - lbY)
                
        return -1
    
    def __averageRGBofLine(self, y) : 
        # y에 있는 모든 픽셀들의 rgb 값의 평균 계산 
        horizon = np.array(self.__imgCV2[y, : , :])
        return (np.mean(horizon, axis=0)).astype(int)

    def __skipInputBoxPixel(self) :
        # 찾으면 해당 높이 픽셀값, 못찾으면 -1 리턴
        stdCritic = 3 
        fail = -1
        imgH = self.__imgCV2.shape[0]

        for lbY in range(imgH-1, int(imgH/2), -1) :
            # recognize input box
            # gray scale은 다 패스
            averageRGB = self.__averageRGBofLine(lbY)

            if self.__isGrayScale(averageRGB, stdCritic=stdCritic) : 
                continue
            else : 
                return lbY
        
        return fail
    
    def __isGrayScale(self, rgb, stdCritic = 5) : 
        # 파라미터인 rgb(3차원 벡터)가 gray scale인지 확인 
        # rgb 각각의 값들의 표준편차가 3 이하면 gray scale로 인식
        if np.std(rgb) <= stdCritic : 
            return True
        else : 
            return False

    def __chatBoxHeight(self,underlineStartX, underlineY) : 
        # 대화 상자의 높이 계산
        height = -1
        white = np.array((255, 255, 255))
        for h in range(underlineY, 0, -1) : 
            # if not self.__isGrayScale(self.__pointRGB(underlineStartX,h), stdCritic=10) : 
            #     return underlineY - h
            if self.__inArray(self.__pointRGB(underlineStartX,h), self.__backgroundColor, scale= 8) : 
                return underlineY - h
        return height

    def __haveSameValues(self, inputList) : 
        # inputList 내 element들이 모두 같은 값을 갖는지 확인
        if inputList : 
            value = inputList[0]
            for x in inputList : 
                if value != x : 
                    return False
            return True
        else : 
            # print("empty chatboxes")
            # 상대 대화창이 없는 것
            return True



    def __getChatboxUnderlines(self):
        # 대화 상자들의 밑변을 구해 (시작점x, 시작점y, length, hieght) 튜플들로 이뤄진 리스트 반환
        inputboxPixel = self.__skipInputBoxPixel() 
        scanStartY = inputboxPixel
        imgW = self.__imgCV2.shape[1]

        if inputboxPixel == -1 : 
            # 입력창이 없는 캡쳐 화면일 경우
            scanStartY = 0

        imgW = self.__imgCV2.shape[1]

        backgroundColor = np.array((216, 199, 178)) # bgr
        whiteColor = np.array((255, 255, 255)) # bgr

        # 대화창이 입력창과 겹쳤나 확인
        scanStartY -= 1
        overlapFlag = 1
        averageRGB = self.__averageRGBofLine(scanStartY)
        if self.__inArray(averageRGB,backgroundColor, scale = 2) : 
            # 중간에 배경이 있다면 안겹쳤다는 것을 의미
            overlapFlag = 0

        if overlapFlag : 
            # 겹쳤을 때 : 대화창과 입력창이 겹쳤으면 쭉 올려서 배경이 나올 때까지 scan할 y축을 올림
            for newY in range(scanStartY, 0, -1) : 
                if self.__inArray(self.__averageRGBofLine(newY), backgroundColor, scale = 2) : 
                    scanStartY = newY
                    break


        whiteboxes = []
        chatboxSearchingFlag = 1
        for y in range(scanStartY, 0, -1) : 
            if chatboxSearchingFlag : 
                averageRGB = self.__averageRGBofLine(y)
                if self.__inArray(averageRGB, backgroundColor, scale=3) :
                    continue   
                else : 
                    # (1) x축 스캔하며 흰 부분 찾기 : chatbox의 underline 직선 찾기
                    underlineStartX = 0
                    whiteScope = []
                    length = 0
                    for x in range(imgW) :
                        if self.__inArray(self.__pointRGB(x,y), whiteColor) :
                            # 첫 시작을 찾았을 때
                            if not whiteScope : 
                                point = (x,y)
                                whiteScope.append(point)
                                if not underlineStartX : 
                                    underlineStartX = x
                        else : 
                            # 끝을 찾았을 때
                            if whiteScope : 
                                point = (x-1,y)
                                whiteScope.append(point)
                                length = x - underlineStartX
                                # (2) chatbox 높이 찾기 
                                height = self.__chatBoxHeight(underlineStartX,y)
                                # (3) (x, y, length, height) 저장
                                whiteboxes.append((underlineStartX,y,length,height))
                                chatboxSearchingFlag = 0
                                break
            else : 
                # 다음 배경 칸으로 가기 
                averageRGB = self.__averageRGBofLine(y)
                if not self.__inArray(averageRGB, backgroundColor, scale=2) :
                    continue  
                else : 
                    # 배경이 등장하면 다시 chatbox 시작 라인 찾기 
                    chatboxSearchingFlag = 1
        # outlier 처리 
        opponentChatboxes = self.__handleOutliers(whiteboxes)
        return opponentChatboxes


    def __handleOutliers(self, whiteboxes) : 
        # outliers들 제외 
        # (1) 최대 대화창 길이보다 길면 제외
        # (2) 시작점이 이미지 넓이의 1/5 지점을 넘어갔으면 제외
        if whiteboxes : 
            exceptOutlier = []
            imgW = self.__imgCV2.shape[1]
            longtextBound = imgW*29/30 
            startUpperBound= imgW*1/5
            startUnderBound = imgW*1/15
            for coordinate in whiteboxes : 
                if coordinate[0] < longtextBound and startUnderBound < coordinate[0] and coordinate[0] < startUpperBound: 
                    exceptOutlier.append(coordinate)
            if len(exceptOutlier) >= 2 :
                exceptOutlier.pop(-1)
            return exceptOutlier
        else : 
            return whiteboxes  

    def isKakaoImage(self) : 
        imgH = int(self.__imgCV2.shape[0]/3)
        imgW = self.__imgCV2.shape[1]
        critic = 0.3
        wholePixelCnt = imgH * imgW
        criticCnt = wholePixelCnt * critic
        bgColorPixelCnt = 0

        for y in range(imgH) : 
            for x in range(imgW) : 
                if self.__inArray(self.__pointRGB(x,y), self.__backgroundColor, scale= 4) : 
                    bgColorPixelCnt += 1 
                if criticCnt < bgColorPixelCnt : 
                    return True
        else : 
            return False 

    def isFakeKakaoApp(self) : 
        upperBound = 4.2
        # underBound = 3.8
        ratio = self.__smileSharpRatio()
        # if ratio < underBound or upperBound < ratio :
        if upperBound < ratio :
            return True, ratio
        else : 
            return False, ratio

    def isKakaoTalkLinedUpHorizontal(self):
        # chatbox 시작점이 같은 x값을 갖는지 
        opponentChatboxes = self.__getChatboxUnderlines()
        chatboxBeginXs = []
        for coordinate in opponentChatboxes :
            underlineX = coordinate[0]
            underlineY = coordinate[1]
            chatboxH = coordinate[3]
            startPoint = (underlineX, underlineY - int(chatboxH/2)) # (x,y)
            for x in range(underlineX, 0, -1) :
                rgb = self.__pointRGB(x,startPoint[1]) 
                if self.__inArray(rgb, self.__backgroundColor) : 
                    # chatboxBeginXs.append((x,underlineY)) # 디버깅 용
                    chatboxBeginXs.append((x)) 
                    break
        # print(chatboxBeginXs)
        # return self.__haveSameValues(chatboxBeginXs), chatboxBeginXs  # 디버깅 용
        return self.__haveSameValues(chatboxBeginXs)

    def getOverallResult(self) : 
        # 결과를 dict 자료구조로 반환
        retDict = {} 
        retDict['isFake'] = False
        retDict['reason'] = 'normal'

        if self.isKakaoImage() : 
            isFakeApp, ratio = self.isFakeKakaoApp()
            if isFakeApp : 
                retDict['isFake'] = True
                retDict['reason'] = 'fakeApp'
                retDict['ratio'] = ratio
            elif self.isKakaoTalkLinedUpHorizontal() == False : 
                retDict['isFake'] = True
                retDict['reason'] = 'notLinedUp'
        else : 
            retDict['isFake'] = False
            retDict['reason'] = 'notKakaoTalk'
        return retDict
            
    # def isKakaoTalkLinedUpVertical(self) : 
    #     # chatbox 간의 수직 간격이 일정한지 비교 
    #     opponentChatboxes = self.__getChatboxUnderlines()
    #     print("미구현")

