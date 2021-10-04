# from typing import collection
from weakref import ProxyTypes
from pymongo.message import insert
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, render_template,request, redirect, jsonify, make_response
import pymongo
import requests
import boto3
import clovaspeechAPI, googleOCR, metaExiftool
from datetime import datetime
import hashlib
# import bcrypt
import config
import json
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, set_access_cookies, set_refresh_cookies, unset_jwt_cookies, create_refresh_token
from bson import json_util
import time, os
import io

app = Flask("__main__")

app.config['JWT_SECRET_KEY']=config.secret_key
app.config['JWT_TOKEN_LOCATION']=['cookies']
app.config['JWT_COOKIE_SECURE']=False
app.config['JWT_COOKIE_CSRF_PROTECT']=True
app.config['JWT_ACCESS_TOKEN_EXPIRES']=30000
app.config['JWT_REFRESH_TOKEN_EXPIRES']=100
app.config['BCRYPT_LEVEL']=10


jwt = JWTManager(app)

filename=''
hashed_filename=''
cur_user = ''

# class JSONEncoder(json.JSONEncoder):
#     def default(self, o):
#         if isinstance(o, ObjectId):
#             return str(o)
#         return json.JSONEncoder.default(self, o)



# Bcrypt = bcrypt(app)

#전역선언X 요청이 올때마다 새로 선언
#커넥션을 계속해서 refresh 해주는 방식으로 변경



# @app.before_request
# def before_request():
#     conn =pymongo.MongoClient('127.0.0.1',27017) #환경변수 ㄱ
    # conn =pymongo.MongoClient('218.146.20.51',27017)
    

# @app.teardown_request
# def teardown_request():
#     conn.close()

@app.route("/")
def my_index():
    return render_template("index.html",tocken="Hello Flask+React")

@app.route("/signup",methods=['GET','POST'])
def signup():
    conn =pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.user

    if request.method == 'GET':
        return render_template("index.html")
    else:
        data=request.get_json()
        userid = data['user_id']
        password = generate_password_hash(data['user_pwd'])
        # re_password = data['user_pwd2']

        print(data)

        userinfo={'social':'local', 'user_nickname':userid, 'user_pwd':password}
        
        # if not (userid and username and password and re_password):    
        if not (userid and password):
            print("input all")
            return jsonify({'result':'input_all'})
        # elif password != re_password:
        #     return jsonify({'result':'check_pwd'})
        else:
            print("db insert")
            try:
                collection.insert_one(userinfo)
            except Exception as e:
                print(e)
            
            return jsonify({'result':'success','msg':'register'})
        

# @app.route("/signup/check",methods=['GET'])
# def check_id():
#     userid = request.form.get('userid')
#     checking = db.user.find_one({'userid':userid})
#     if checking is not None:
#         return jsonify({'result':'fail','msg':'already existed'})

@app.route("/oauth",methods=['GET','POST'])
def oauth():
    conn =pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.user
    # code = request.args.get('code')
    param = request.get_json()
    print(param)
    print(type(param))
    if(param):
        client_id = param['client_id']
        redirect_uri = param['redirect_uri']
        code = param['code']

        response = requests.request(
        method="POST",
        url = "https://kauth.kakao.com/oauth/token",
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cache-Control": "no-cache",
        },
        data = {
            "grant_type": "authorization_code",
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "code": code,
            }
        )
        res = response.json()
        if(res):
            access_token = res['access_token']
            refresh_token = res['refresh_token']
            print(res)
            # print(res['access_token'])
            # print(res['refresh_token'])

            response2 = requests.get(
                
                url = "https://kapi.kakao.com/v2/user/me",
                headers={
                    'Authorization':"Bearer " + access_token,
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                    "Cache-Control": "no-cache"
                }
            )
            res2 = response2.json()
            print(res2)
            if(res2):
                id = res2['id']
                nickname = res2['properties']['nickname']
                print(id)
                print(nickname)
                userinfo={'social':'kakao','user_id':id, 'user_nickname':nickname}
                collection.insert_one(userinfo)

                resp = make_response(render_template("index.html"))
                access_tk = create_access_token(identity=id)
                refresh_tk = create_refresh_token(identity=id)
                resp.set_cookie("logined", "true")
                set_access_cookies(resp,access_tk)
                set_refresh_cookies(resp,refresh_tk)
            return resp
            # return render_template("index.html")    

    else:
        return render_template("index.html")
    
@app.route('/logout')
def token_remove():
    resp=jsonify({'result':True})
    unset_jwt_cookies(resp)
    resp.delete_cookie('logined')
    return resp

@app.route('/login',methods=['GET','POST'])
def login():
    conn =pymongo.MongoClient(config.mongodb)
    # conn =pymongo.MongoClient('mongodb://AdminGoldory:king3680!@218.146.20.51:27017')
    db = conn.jb_db
    collection = db.user

    data = request.get_json()
    if(data):
        user_id = data['user_id']
        user_pwd =  generate_password_hash(data['user_pwd'])

        user = collection.find_one({'user_nickname':user_id},{'user_pwd':user_pwd})

        if user is None:
            print(user)
            print(user_id)
            print(user_pwd)
            return jsonify({'login':False})
        else:
            resp = make_response(render_template("index.html"))
            access_tk = create_access_token(identity=user_id)
            refresh_tk = create_refresh_token(identity=user_id)
            resp.set_cookie("logined", "true")
            set_access_cookies(resp,access_tk)
            set_refresh_cookies(resp,refresh_tk)
            return resp   

@app.route('/getuser',methods=['GET','POST'])
@jwt_required()
def getuser():
    conn =pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.stt
    global cur_user
    cur_user = get_jwt_identity()
    print(type(cur_user))
    print(cur_user)
    user = list(collection.find({'user_id':cur_user}))
    return json.dumps(user,default=json_util.default)

@app.route('/upload', methods = ['GET', 'POST'])
def uploads():
    
    import hashlib
    import time
    import os
    from werkzeug.datastructures import FileStorage
    
    if request.method == 'POST':
        #<------ 업로드한 파일 row 생성 과정 ------>#
        conn =pymongo.MongoClient(config.mongodb)
        db = conn.jb_db
        now=time.localtime()
        collection = db.stt
        s3=boto3.client(
            's3',
            aws_access_key_id="AKIA3EDWU7TFZ5GQEEC5", #--> 승구's aws
            aws_secret_access_key="9wQzgyV7Z2JfGFVRjUJ6hf73UNs3oBBm4ZNjkKlE", #--> 승구's aws            
        )

        meta = metaExiftool.metaExiftool()

        audio=['.m4a','.wav','.mp3','.aac','.ac3','.flac']
        image=['.bmp','.dib','.jpeg','.jpg','.jpe','.jp2','.png','.webp','.pbm','.pgm','.ppm','.sr','.ras','.tiff','.tif']
        
        f = request.files['file']
        current_time = str(datetime.now())
        name=f.filename
        hashed_name=hashlib.sha256((current_time+name).encode('utf-8')).hexdigest()
        global filename
        filename=name
        global hashed_filename
        hashed_filename=hashed_name
        insert_data={}
        fileName,fileExt=os.path.splitext(filename)
        url='https://craftguy.s3.ap-northeast-2.amazonaws.com/'+hashed_name

        if(fileExt in audio):
            insert_data['filetype']='녹음 파일'    
            insert_data['state']='변환중'
            insert_data['text']=''
            s3.upload_fileobj(f,'craftguy',hashed_name,ExtraArgs={'ACL':'public-read'})
            #ServerSideEncryption='aws:kms',SSEKMSKeyId='alias/aws/s3'
            url='https://craftguy.s3.ap-northeast-2.amazonaws.com/'+hashed_name
            #--> 접근 가능한 s3에 올라가는 파일 경로
            clovaspeechAPI.ClovaSpeechClient().req_url(url=url, completion='async')
            #--> s3 파일을 읽어 API로 넘겨주는 과정

            returnDict = meta.getAudioTags(url)
            print(returnDict)
            insert_data['metadata']=returnDict

        elif (fileExt in image):
            s3.upload_fileobj(f,'craftguy',hashed_name,ExtraArgs={'ACL':'public-read'})
            try:
                ocr = googleOCR.googleOCR()
                ocrJson = ocr.getOCRjson(url)
                fullscript=ocr.getFullScriptFromJson(ocrJson)
                print(fullscript)
                insert_data['text'] = fullscript
            except:
                pass
            insert_data['filetype']='사진 파일'
            insert_data['state']='변환완료'

            returnDict = meta.getImageTags(url)
            print(returnDict)
            insert_data['metadata'] = returnDict

        insert_data['filename']=filename
        insert_data['hashed_filename']=hashed_filename
        insert_data['segments']=''
        insert_data['user_id']=cur_user
        insert_data['index']=collection.find({'user_id':cur_user}).count()+1
        time="%04d-%02d-%02d %02d:%02d:%02d"% (now.tm_year, now.tm_mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec)
        insert_data['uploaded_time']=str(time)
        
        collection.insert_one(insert_data)
        
        return render_template("index.html")

    else:
        return render_template("index.html")
    

@app.route('/Receive',methods=['POST'])
def receive():
    import time
    conn =pymongo.MongoClient(config.mongodb)    
    db = conn.jb_db
    collection = db.stt    
    data=request.get_json()
    o_segments=data['segments']    
    o_query={'user_id':cur_user,'hashed_filename':hashed_filename}
    segments=[]
    tmp={}
    tmp['speaker']=o_segments[0]['speaker']['name']
    tmp['stt']=o_segments[0]['text']
    segments.append(tmp)
    t=0
    for i in range(len(o_segments)-1):
        if(o_segments[i]['speaker']['name']==o_segments[i+1]['speaker']['name']):
            segments[t]['stt']+=o_segments[i+1]['text']        
        else:
            t=t+1
            speaker_data={}
            speaker_data['speaker']=o_segments[i+1]['speaker']['name']
            speaker_data['stt']=o_segments[i+1]['text']
            segments.append(speaker_data)    
    collection.update(o_query,{"$set":{'segments':segments}})
    collection.update(o_query,{"$set":{'text':data['text']}})
    collection.update(o_query,{"$set":{'state':"변환완료"}})
    #<-- 기존에 존재하는 파일의 segments와 text에 해당하는 column 업데이트 -->#  
    return render_template("index.html")

if __name__=='__main__':
 app.run(host='0.0.0.0', port=5000, debug=True)

# app.run(debug=True)