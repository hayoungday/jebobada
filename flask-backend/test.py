from kakaoForgeryDetect import kakaoForgeryDetect
from detectEdition import detectEdition
import time 


# 경로에 한글 포함되면 안되는데 s3에선 한글 안 쓰임
imgPath = '.\\app\\' + 'KakaoTalk_20211020_180802625_01.jpg' # 카톡 조작 1
imgPath = '.\\app\\' + 'KakaoTalk_20211020_180802625_02.jpg' # 카톡 조작 2
# imgPath = '.\\app\\' + 'KakaoTalk_20211020_160429241.jpg'    # 카톡 네비게이션 없는거 1
imgPath = '.\\app\\' + 'unarranged1.jpg'    # 카톡 네비게이션 없는거 1
# imgPath = '.\\app\\' + 'KakaoTalk_20211020_160429241.jpg'    # 카톡 네비게이션 없는거 1
# imgPath = '.\\app\\' + 'KakaoTalk_20211020_210351506.jpg'    # 준형 카톡(galaxy a6)
imgPath = '.\\app\\' + 'sungu.jpg'    # 카톡 네비게이션 없는거 1
# imgPath = '.\\app\\' + 'notalk.jpg'    # 카톡 네비게이션 없는거 1
imgPath = '.\\app\\' + 'unarranged1.jpg'    # 카톡 네비게이션 없는거 1
# imgPath = r"C:\Users\HJun\Desktop\detectEdition\이미지_편집\unarranged_ps.png"
# imgPath = "https://craftguy.s3.ap-northeast-2.amazonaws.com/1e41ed5098504c847da542849a90628c8f1379683a3f3f9bf74d4b818bb65f22"
# imgPath = "https://craftguy.s3.ap-northeast-2.amazonaws.com/4171686e013291ff3b912874b60bcc1ab1a4540e8e7ec2a80e7f8bdc1001e056"

startTime = time.time()
kfdModule = kakaoForgeryDetect(imgPath)
overallResult = kfdModule.getOverallResult()

detectInstance = detectEdition()
detectInstance.setFilePath(imgPath)
useImageEditor = detectInstance.useImageEditor()
# isKakaoImage = kfdModule.isKakaoImage()
# print("use image editor? : ", useImageEditor)
# print("is kakao image? : ", isKakaoImage)
# if isKakaoImage : 
#     print("is fake kakao app? : ", kfdModule.isFakeKakaoApp())
#     print("is chatbox lined up? : ", kfdModule.isKakaoTalkLinedUpHorizontal())




if overallResult['isFake'] : 
	print("결과 : 조작된 카카오톡 대화창입니다")
	if overallResult['reason'] == 'notLinedUp' :
		print("근거 : 카카오톡 대화창이 바르게 정렬되지 않았습니다.") 
	elif overallResult['reason'] == 'fakeApp' :
		print("근거 : 카카오톡 조작어플(톡썰메이커)가 사용된 흔적을 발견했습니다.")
elif not useImageEditor : 
	print("결과 : 편집 흔적이 발견되지 않음")
	print("근거 : 편집 프로그램을 사용하거나 이미지를 조작한 흔적을 찾을 수 없습니다")
elif useImageEditor  : 
	print("결과 : 편집흔적 발견")
	print("근거 : 다음 프로그램 사용 흔적 발견 - ", useImageEditor)



print("time : ", time.time() - startTime)


