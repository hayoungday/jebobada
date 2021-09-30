# 구글 OCR 
#
# 설명 
#     구글 클라우드의 vision 모듈을 사용해 response를 받음
#     - 서비스 계정 키 파일 경로가 GOOGLE_APPLICATION_CREDENTIALS 환경변수로 저장되어 있어야 함
#     1초 정도 걸림
#
# 사용법
#     1) getOCRjson(이미지 경로) : OCR 결과 json 받아오기
#     2) getFullScriptFromJson(ocr 결과 json) : OCR json에서 전체 스크립트 가져오기 
#
# 조건 
#     - 환경변수로 서비스 계정 키 파일을 설정해야 함 : https://cloud.google.com/vision/docs/setup?hl=ko
#     - 클라이언트 라이브러리 설치 필요 : https://cloud.google.com/vision/docs/libraries?hl=ko
#         - pip install --upgrade google-cloud-vision
# 
# api 사용 제약 사항
#     - 최대 파일 크기 : 4MB


from google.cloud import vision
from google.cloud import vision_v1
import io
import os
import json
import time 
import urllib.request


class googleOCR : 
    def __init__(self) -> None:
        # 테스트 환경에 api key가 저장된 json 파일 경로를 환경변수로 저장
        # 실제 구현에서는 set environment variable 할 필요 없음
        try : 
            self.setEnvVar() # 테스트에서만 사용
            pass
        except : 
            print('googleOCR class : class Instantiating Fail')
    
    def setEnvVar(self) : # 테스트에서만 사용
        # 환경변수 설정 : 서비스 계정 키 파일 경로 설정
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"]=r"C:\Users\goldo\Downloads\pelagic-berm-326302-83e0cfee0c82.json"

    def getFullScriptFromJson(self, resj) : # resj = ocr 
        # json에서 전체 스크립트 가져오기
        fullScript = resj['fullTextAnnotation']['text']
        return fullScript


    def getOCRjson(self, filePath) :         # filePath = 이미지 파일 경로
        # 이미지 파일의 OCR 결과를 json으로 그대로 반환
        # Instantiates a client
        # 여기서 서비스 계정 키 json 파일이 사용되는 듯
  
        client = vision.ImageAnnotatorClient()
        # print('googleOCR class : client Instantiating Fail')
        # 메모리에 이미지 로드

        req = urllib.request.Request(filePath)
        with urllib.request.urlopen(req) as response:
            content = response.read()

        image = vision.Image(content=content)

        # OCR 실행
        response = client.document_text_detection(image=image) # text_detection을 사용하면 초성이 글씨로 바뀜(ㅈ->즈)
        # - RepeatedComposite를 반환 
        # - RepeatedComposite는 EntityAnnotation 리스트로 이루어져 있음 
        # - EntityAnnotation 중 description 속성에 script나 word가 있음

        if response.error.message:
            raise Exception(
                '{}\nFor more info on error messages, check: '
                'https://cloud.google.com/apis/design/errors'.format(
                    response.error.message))

        # 결과 json으로 변경
        resJ = json.loads(vision_v1.AnnotateImageResponse.to_json(response))
        if not resJ :
            print("googleOCR : getOCRjson - empty json")
        return resJ