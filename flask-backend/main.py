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
from flask_bcrypt import Bcrypt
import config
import json
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, set_access_cookies, set_refresh_cookies, unset_jwt_cookies, create_refresh_token
from bson import json_util
import time, os
from io import BufferedReader

app = Flask("__main__")

app.config['JWT_SECRET_KEY']=config.secret_key
app.config['JWT_TOKEN_LOCATION']=['cookies']
app.config['JWT_COOKIE_SECURE']=False
app.config['JWT_COOKIE_CSRF_PROTECT']=True
app.config['JWT_ACCESS_TOKEN_EXPIRES']=30000
app.config['JWT_REFRESH_TOKEN_EXPIRES']=100

app.config['BCRYPT_LEVEL']=10
app.config['SECRET_KEY']='hayoungday'


jwt = JWTManager(app)
bcrypt = Bcrypt(app)

bcrypt = Bcrypt(app)

filename=''
hashed_filename=''
cur_user = ''

@app.route("/")
def my_index():
    return render_template("index.html",tocken="Hello Flask+React")

@app.route("/check_double", methods=['GET','POST'])
def check_double():
    conn = pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.user

    if request.method == 'GET':
        return render_template("index.html")
    else:
        data=request.get_json()
        user_id = data['user_id']
        user = list(collection.find({'user_nickname':user_id}))
        print(user)
        if user:
            return jsonify({'result':'fail'})
        else:
            return jsonify({'result':'success'})
            
        


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
        password = bcrypt.generate_password_hash(data['user_pwd'])
        password2 = data['user_pwd2']
        print(bcrypt.check_password_hash(password, data['user_pwd2']))
        print(password)
        # re_password = data['user_pwd2']

        print(data)

        userinfo={'social':'local', 'user_nickname':userid, 'user_pwd':password}
        
        # if not (userid and username and password and re_password):    
        if not (userid and password and password2):
            print("input all")
            return jsonify({'result':'input_all'})
        elif bcrypt.check_password_hash(password, data['user_pwd2']) == False:
            print("check password")
            return jsonify({'result':'check_pwd'})
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
    import time
    
    # <--------------- access 하는 클라이언트 ip 얻기 ---------------->#
    access_ip=request.environ.get('HTTP_X_REAL_IP',request.remote_addr)
    print("로그인 한 ip : ",access_ip)
    conn =pymongo.MongoClient(config.mongodb)
    
    db = conn.jb_db
    collection = db.user

    data = request.get_json()
    if(data):
        if (data['user_id'] and data['user_pwd']):
            user_id = data['user_id']
            user_pwd = data['user_pwd']
            # user_pwd = bcrypt.generate_password_hash(data['user_pwd'])

            # user=list(collection.find({"$and":[
            #             {'user_nickname':user_id},
            #             {'user_pwd':user_pwd},
            #         ]}))
            
            user = list(collection.find({'user_nickname':user_id}))
            if user:
                db_pwd = user[0]['user_pwd']
                valid = bcrypt.check_password_hash(db_pwd.decode('utf-8'), user_pwd)
                if valid == False:
                    now=time.localtime()
                    time="%04d-%02d-%02d %02d:%02d:%02d"% (now.tm_year, now.tm_mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec)
                    print("로그인 실패 시각 :",str(time))
                    access_log={"access_time":str(time),"access_ip":access_ip,"login":"fail"}
                    print(access_log)
                    collection.update_one({"user_nickname":user_id},{"$push":{"access_log":access_log}})
                    return jsonify({'login':False}), render_template("index.html")
                else:
                    now=time.localtime()
                    time="%04d-%02d-%02d %02d:%02d:%02d"% (now.tm_year, now.tm_mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec)
                    print("로그인 성공 시각 :",str(time))
                    access_log={"access_time":str(time),"access_ip":access_ip,"login":"success"}
                    print(access_log)
                    collection.update_one({"user_nickname":user_id},{"$push":{"access_log":access_log}})
                    resp = make_response(render_template("index.html"))
                    access_tk = create_access_token(identity=user_id)
                    refresh_tk = create_refresh_token(identity=user_id)
                    resp.set_cookie("logined", "true")
                    set_access_cookies(resp,access_tk)
                    set_refresh_cookies(resp,refresh_tk)
                    return resp
            else:
                
                return jsonify({'login':False}), render_template("index.html")
            
        else:
            return jsonify({'login':False}), render_template("index.html")
    else:
        # return jsonify({'login':False}), render_template("index.html")
        return render_template("index.html")


@app.route('/getuser',methods=['GET','POST'])
@jwt_required()
def getuser():
    global cur_user
    cur_user = get_jwt_identity()
    return jsonify({'user':cur_user})

@app.route('/upload', methods = ['GET', 'POST'])
def upload():
    import hashlib
    import time
    import os
    from werkzeug.datastructures import FileStorage


    if request.method == 'POST':
        
        conn =pymongo.MongoClient(config.mongodb)
        db = conn.jb_db
        now=time.localtime()
        collection = db.stt
        meta = metaExiftool.metaExiftool()
        audio=['.m4a','.wav','.mp3','.aac','.ac3','.flac']
        image=['.bmp','.dib','.jpeg','.jpg','.jpe','.jp2','.png','.webp','.pbm','.pgm','.ppm','.sr','.ras','.tiff','.tif']
        print(request)
        
        case_num = request.form['case_num']
        user = request.form['user']
        date = request.form['date']
        location = request.form['location']
        attacker = request.form['attacker']
        desc = request.form['desc']
        types = request.form['type']

        print(str(case_num), str(user))
        print(request.files)
        print(len(request.files))
        print(request.form)
        f=request.files['file']
        # f=request.form['file']
        
        file_hash_data=hashlib.md5(f.read()).hexdigest()
        print("case_num 타입",type(case_num))
        print("file_hash_data 타입",type(file_hash_data))          
        
        #<------------------ 해시 일치하는 파일 찾기 ------------------->#
        hash_cnt=0                
        hash_cnt=(collection.find({
                "$and":[
                    {'user_id':user},
                    {'casenum':str(case_num)},
                    {'file_hash_data':file_hash_data}                
                ]
                }
                ).count()
            )
        if(hash_cnt!=0):
            print("file_uplpad_blocked")
            return {"result":"file_upload_block"}
        #<------------------                    ------------------->#
              
        global filename
        
        current_time = str(datetime.now())
        name=f.filename
        hashed_name=hashlib.sha256((current_time+filename).encode('utf-8')).hexdigest()
        filename=name
        print(filename)
        global hashed_filename
        hashed_filename=hashed_name
        insert_data={}
        fileName,fileExt=os.path.splitext(filename)
        url='https://craftguy.s3.ap-northeast-2.amazonaws.com/'+hashed_name
        try:           
            insert_data['file_hash_data']=file_hash_data
        except:
            print("hash calculate error")
            pass
        
        f.seek(0)

        if(fileExt in audio):
            insert_data['filetype']='녹음 파일'    
            insert_data['state']='변환중'
            insert_data['text']=''
            insert_data['metadata']=[]
            insert_data['casenum']=case_num
            insert_data['filename']=filename
            insert_data['hashed_filename']=hashed_filename
            insert_data['segments']=''
            insert_data['user_id']=user
            insert_data['date']=date
            insert_data['location']=location
            insert_data['attacker']=attacker
            insert_data['desc']=desc
            insert_data['type']=types
            insert_data['index']=collection.find({'user_id':user}).count()+1
            time="%04d-%02d-%02d %02d:%02d:%02d"% (now.tm_year, now.tm_mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec)
            insert_data['uploaded_time']=str(time)            
            
            s3=boto3.client(
            's3',
            aws_access_key_id=config.aws_access_key_id, #--> 승구's aws
            aws_secret_access_key=config.aws_secret_access_key, #--> 승구's aws            
            )
            
            collection.insert_one(insert_data)
                        
            s3.upload_fileobj(f,'craftguy',hashed_name,ExtraArgs={'ACL':'public-read'})
            #'ServerSideEncryption':'aws:kms'  
                  
            
            url='https://craftguy.s3.ap-northeast-2.amazonaws.com/'+hashed_name
            clovaspeechAPI.ClovaSpeechClient().req_url(url=url, completion='async')
            returnDict = meta.getAudioTags(url)
            o_query={'user_id':cur_user,'hashed_filename':hashed_filename}
            insert_data['metadata']=returnDict
            collection.update(o_query,{"$set":{'metadata':insert_data['metadata']}})

        elif (fileExt in image):   
            insert_data['text']=''
            insert_data['casenum']=case_num
            insert_data['filename']=filename
            insert_data['hashed_filename']=hashed_filename
            insert_data['segments']=''
            insert_data['user_id']=user
            insert_data['date']=date
            insert_data['location']=location
            insert_data['attacker']=attacker
            insert_data['desc']=desc
            insert_data['type']=types
            insert_data['index']=collection.find({'user_id':user}).count()+1
            time="%04d-%02d-%02d %02d:%02d:%02d"% (now.tm_year, now.tm_mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec)
            insert_data['uploaded_time']=str(time)            
            
            s3=boto3.client(
            's3',
            aws_access_key_id=config.aws_access_key_id, #--> 승구's aws
            aws_secret_access_key=config.aws_secret_access_key, #--> 승구's aws            
            )
            s3.upload_fileobj(f,'craftguy',hashed_name,ExtraArgs={'ACL':'public-read'})
            try:
                ocr = googleOCR.googleOCR()
                ocrJson = ocr.getOCRjson(url)
                fullscript=ocr.getFullScriptFromJson(ocrJson)
                # print(fullscript)
                insert_data['text'] = fullscript
            except:
                pass

            insert_data['filetype']='사진 파일'
            insert_data['state']='변환완료'

            returnDict = meta.getImageTags(url)
            print(type(returnDict))
            insert_data['metadata'] = returnDict
            collection.insert_one(insert_data)

        return {"result":"success"}
    else:
        return {"result":"error"}
    

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

@app.route('/Agree')
def Agree():
    return render_template("index.html")

@app.route('/analysis')
def analysis():
    return render_template("index.html")

@app.route('/uploadevidence')
def uploadevidence():
    return render_template("index.html")

@app.route('/casepage', methods = ['GET', 'POST'])
def casepage():
    conn=pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.case
    data= request.get_json()
    print("data",data)
    if(data):
        insert_data = {}
        insert_data['CaseName'] = data['case_name']
        insert_data['Description'] = data['description']
        insert_data['User'] = data['user']
        insert_data['index']=collection.find({'User':data['user']}).count()+1
        print(insert_data['index'])

        collection.insert_one(insert_data)
    else:
        print("no data")
            
    return render_template("index.html")

@app.route('/getcases', methods=['GET','POST'])
def getcases():
    conn=pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.case

    data = request.get_json()
    if (data):
        user = data['user']
        cases = list(collection.find({'User':user}))

        return json.dumps(cases, default=json_util.default)
    else:
        print("getcases error")
    
@app.route('/getevidences', methods=['GET','POST'])
def getevidences():
    conn =pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.stt

    if request.method=='GET':
        if(request.args.get("keyword")):
            collection.create_index([('text','text')])
            keyword=request.args.get("keyword")
            casenum=request.args.get("casenum")
            print(keyword)
            print(casenum)        
            user=list(collection.find({
                "$and":[
                    {'user_id':cur_user},
                    {'casenum':casenum},
                    {"text":{"$regex":keyword}}                
                ]
                }
                )
            )
        else:
            user = list(collection.find({'user_id':cur_user}))    
        return json.dumps(user,default=json_util.default)


    elif request.method=='POST':
        data = request.get_json()
        if(data):
            user=data['user']
            casenum=data['casenum']

            try:
                index=int(data['idx'])
                evidence = list(collection.find({"$and":[
                {'user_id':user},
                {'casenum':casenum},
                {'index':index}
                ]}))
    
            except:
                evidence = list(collection.find({"$and":[
                {'user_id':user},
                {'casenum':casenum}
                ]}))                

            return json.dumps(evidence, default=json_util.default)
        else:
            return {"result":"getevidences api error"}

@app.route('/getAccesslog',methods=['GET','POST'])
def getAccesslog():
    conn=pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.user

    data = request.get_json()

    print(data)
    if (data):
        user = data['user_nickname']
        cases = list(collection.find({'user_nickname':user}))
        print("유저:",user)
        return json.dumps(cases, default=json_util.default)
    else:
        print("getAccesslog error")

@app.route("/deletecase",methods=['GET','POST'])
def deletecase():
    conn=pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.case
    collection2 = db.stt

    data = request.get_json()

    print(data)

    collection.remove({
        "$and":[
            {'CaseName':data['case_name']},
            {'User':data['user']}                
        ]
        }
    )

    collection2.remove({
        "$and":[
            {'user_id':data['user']},
            {'casenum':str(data['casenum'])}
        ]
    })

    print(list(collection2.find({
        "$and":[
            {'user_id':data['user']},
            {'casenum':str(data['casenum'])}
        ]
    })))
    print(data['user'])
    print(data['casenum'])
    
    return render_template("index.html")

@app.route("/deleteevidence",methods=['GET','POST'])
def deleteevidence():
    conn=pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.stt

    data = request.get_json()

    print(data)
    
    collection.remove({
        "$and":[
            {'casenum':data['casenum']},
            {'filename':data['filename']},
            {'user_id':data['user']}                
        ]
        }
    )
    
    return render_template("index.html")

@app.route("/caseupdate",methods=['GET','POST'])
def caseupdate():
    conn=pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.case

    data = request.get_json()

    user = data['user']['user']
    case_name = data['case_name']['case_name']
    description = data['description']

    collection.update({
        "$and":[
            {'CaseName':case_name},
            {'User':user}
        ]
    },{
        "$set":{"Description":description}
    })
    

    return data

@app.route("/evidenceupdate",methods=['GET','POST'])
def evidenceupdate():
    conn=pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.stt

    case_num = request.form['case_num']
    user = request.form['user']
    index = request.form['index']

    date = request.form['date']
    location = request.form['location']
    attacker = request.form['attacker']
    types = request.form['type']
    desc = request.form['desc']

    print(case_num,user,index)
    print(type(case_num))
    print(type(user))
    print(type(index))
    print(type(types))
    print(date,location,attacker,types,desc)

    collection.update_one({
        "$and":[
            {'casenum':case_num},
            {'user_id':user},
            {'index':int(index)}
        ]
    },{
        "$set":
            {'date':date,
            'location':location,
            'attacker':attacker,
            'type':types,
            'desc':desc}
        
    })

    return "success"


if __name__=='__main__':
 app.run(host='0.0.0.0', port=5000, debug=True)