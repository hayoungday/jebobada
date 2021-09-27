import pymongo

conn =pymongo.MongoClient('127.0.0.1',27017)
db = conn.stt
test = db.test

res=test.find_one({'hashed_filename':'806ec0e619242c6e286a228d19d1e3fc'})
#-->각 파일 식별자 넣기

for i in range(len(res['segments'])):
    if(res['segments'][i-1]['speaker']['name']!=res['segments'][i]['speaker']['name']):
        print("\n\n화자"+res['segments'][i]['speaker']['name'])
    print(res['segments'][i]['text'],end=" ")
#--> 화자별 대화로 변경
