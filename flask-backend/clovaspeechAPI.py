import requests
import json
import config

class ClovaSpeechClient:
    invoke_url = 'https://clovaspeech-gw.ncloud.com/external/v1/1351/355543f790a3b210ecf36c82a2738896d9574c17e963a63633febac1f2386737'
    secret = '2563d813a080490583fa218e2b3fc881'
    #--> 승구's Clova 계정
    def req_url(self, file, completion, callback=None, userdata=None, forbiddens=None, boostings=None, wordAlignment=True, fullText=True, diarization=None):
        request_body = {
            'language': 'ko-KR',
            'completion': completion,
            
            'callback': config.clova_redirect,
            #--> 서버 주소 넣어야 함
            'userdata': userdata,
            'wordAlignment': wordAlignment,
            'fullText': fullText,
            'forbiddens': forbiddens,
            'boostings': boostings,
            'diarization': diarization,
        }
        headers = {
            'Accept': 'application/json;UTF-8',
            'X-CLOVASPEECH-API-KEY': self.secret
        }
        files = {
            'media': open(file, 'rb'),
            'params': (None, json.dumps(request_body, ensure_ascii=False).encode('UTF-8'), 'application/json')
        }
        response = requests.post(headers=headers, url=self.invoke_url + '/recognizer/upload', files=files)
        