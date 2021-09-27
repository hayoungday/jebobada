import requests
import json


class ClovaSpeechClient:
    invoke_url = 'https://clovaspeech-gw.ncloud.com/external/v1/1351/355543f790a3b210ecf36c82a2738896d9574c17e963a63633febac1f2386737'
    secret = '2563d813a080490583fa218e2b3fc881'
    #--> 승구's Clova 계정
    def req_url(self, url, completion, callback=None, userdata=None, forbiddens=None, boostings=None, wordAlignment=True, fullText=True, diarization=None):
        request_body = {
            'url': url,
            'language': 'ko-KR',
            'completion': completion,
            'callback': 'http://14.138.175.117:5500/Receive',
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
            'Content-Type': 'application/json;UTF-8',
            'X-CLOVASPEECH-API-KEY': self.secret
        }
        return requests.post(headers=headers,
                             url=self.invoke_url + '/recognizer/url',
                             data=json.dumps(request_body).encode('UTF-8'))
