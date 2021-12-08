# from typing import collection
from weakref import ProxyTypes
from pymongo.message import insert
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, render_template,request, redirect, jsonify, make_response
import pymongo
import requests
import boto3
import clovaspeechAPI, googleOCR, metaExiftool,check_csv
import detectEdition #음성
import kakaoForgeryDetect
from datetime import datetime
import hashlib
from bson.objectid import ObjectId
from flask_bcrypt import Bcrypt
from io import BufferedReader
import config
import json,csv
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
app.config['SECRET_KEY']='hayoungday'


jwt = JWTManager(app)
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
        
        # data=request.get_json()
        # print(data)
        # print(data['attacker'])
        # print(type(data['attacker']))

        case_num = request.form['case_num']
        user = request.form['user']
        date = request.form['date']
        location = request.form['location']
        attacker = request.form['attacker'].split(",")
        desc = request.form['desc']
        types = request.form['type'].split(",")
        mainevdi = request.form['mainevdi']
        
        print("\n\n\n\n\n\ntype is",type(attacker))

        # try:
        #     date = request.form['date']
        # except:
        #     pass
        # try:
        #     location = request.form['location']
        # except:
        #     pass
        # try:
        #     attacker = request.form['attacker']
        # except:
        #     pass
        # try:
        #     desc = request.form['desc']
        # except:
        #     pass
        # try:
        #     types = request.form['type']
        # except:
        #     pass

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
        
        try:           
            insert_data['file_hash_data']=file_hash_data
        except:
            print("hash calculate error")
            pass
        
        f.seek(0)
        f.save("test")
        f.seek(0)
        url='./test'

        if(fileExt in audio):
            insert_data['choosedOnReport']=False
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
            insert_data['ismain']=mainevdi
            insert_data['index']=collection.find({'user_id':user}).count()+1
            time="%04d-%02d-%02d %02d:%02d:%02d"% (now.tm_year, now.tm_mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec)
            insert_data['uploaded_time']=str(time)            
            
            _id=collection.insert_one(insert_data)
            #print("---------------------",_id.inserted_id)
            tmp=f.read()
            #tmp는 f를 바이너리로 읽은 값

            pass_string=request.form['key']
            #pass_string은 사용자가 입력한 비밀번호 값

            pass_string_bytes=bytes(pass_string,'utf-8')

            values=bytearray(tmp)

            cipher=pass_string_bytes*(len(values)//len(pass_string_bytes))+pass_string_bytes[:len(values)%len(pass_string_bytes)]

            cipherdata=bytes(p^k for p,k in zip(values,cipher))
            
            plaindata=bytes(p^k for p,k in zip(cipherdata,cipher))

            res=io.BytesIO(cipherdata)
            # res=io.BytesIO(plaindata)

            s3=boto3.client(
            's3',
            aws_access_key_id=config.aws_access_key_id, #--> 승구's aws
            aws_secret_access_key=config.aws_secret_access_key, #--> 승구's aws            
            )
            
            s3.upload_fileobj(res,'craftguy',hashed_name,ExtraArgs={'ACL':'public-read'})
            
            clovaspeechAPI.ClovaSpeechClient().req_url(file=url, completion='async')
            
            returnDict = meta.getAudioTags(url)
            o_query={'user_id':cur_user,'hashed_filename':hashed_filename}
            insert_data['metadata']=returnDict
            
            ###편집여부 backend###
            
            detEdi = detectEdition.detectEdition()
            detEdi.setFilePath(url)
            
            useFamousApp = detEdi.useFamousRecorderApp()
            isEditted_dic = detEdi.isEditted()
            isEditted = isEditted_dic['isEditted']
            
            editted_result = ""
            
            if (useFamousApp):
                print('편집아님1')
                insert_data['edited']="false"

            elif (useFamousApp == None and isEditted == True):
                print('편집됨')
                insert_data['edited']="true"
                
                if isEditted_dic['reason'] == "meta":
                    insert_data['reason'] = "meta"
                    insert_data['relatedMetadata'] = isEditted_dic['relatedMetadataFields']
                    insert_data['programNames'] = isEditted_dic['programNames'][0]
                elif isEditted_dic['reason'] == "cmt":
                    insert_data['reason'] = "cmt"
                
            elif (useFamousApp == None and isEditted == False):
                print('편집아님')
                insert_data['edited']="false"
                
            else:
                editted_result = "else"
                print("error 삐용삐용 ")
            
            print("=========================")
            print(useFamousApp)
            print(isEditted_dic)
            print(isEditted)
            print(editted_result)
            print("=========================")
            
            collection.update_one({'_id':ObjectId(_id.inserted_id)},{"$set":insert_data})
            os.remove("./test")
            
            
            ###STT
            
            
            # collection.update(o_query,{"$set":{'metadata':insert_data['metadata']}})

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
            insert_data['ismain']=mainevdi
            insert_data['index']=collection.find({'user_id':user}).count()+1
            time="%04d-%02d-%02d %02d:%02d:%02d"% (now.tm_year, now.tm_mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec)
            insert_data['uploaded_time']=str(time)
            insert_data['filetype']='사진 파일'
            insert_data['state']='분석중'
            _id=collection.insert_one(insert_data)
            #print("---------------------",_id.inserted_id)
            tmp=f.read()
            #tmp는 f를 바이너리로 읽은 값

            pass_string=request.form['key']
            #pass_string은 사용자가 입력한 비밀번호 값

            pass_string_bytes=bytes(pass_string,'utf-8')

            values=bytearray(tmp)

            cipher=pass_string_bytes*(len(values)//len(pass_string_bytes))+pass_string_bytes[:len(values)%len(pass_string_bytes)]

            cipherdata=bytes(p^k for p,k in zip(values,cipher))
            
            plaindata=bytes(p^k for p,k in zip(cipherdata,cipher))

            res=io.BytesIO(cipherdata)
            # res=io.BytesIO(plaindata)

            s3=boto3.client(
            's3',
            aws_access_key_id=config.aws_access_key_id, #--> 승구's aws
            aws_secret_access_key=config.aws_secret_access_key, #--> 승구's aws            
            )
            
            s3.upload_fileobj(res,'craftguy',hashed_name,ExtraArgs={'ACL':'public-read'})

            try:
                ocr = googleOCR.googleOCR()
                ocrJson = ocr.getOCRjson(url)
                fullscript=ocr.getFullScriptFromJson(ocrJson)
                # print(fullscript)
                insert_data['text'] = fullscript
            except:
                pass

            

            returnDict = meta.getImageTags(url)

            insert_data['metadata'] = returnDict
            
            
            # ===카톡조작===
            kfdModule = kakaoForgeryDetect.kakaoForgeryDetect(url)
            detEdi = detectEdition.detectEdition()
            detEdi.setFilePath(url)
            
            print("-------------------------------")
            
            overallResult = kfdModule.getOverallResult()
            useImageEditor = detEdi.useImageEditor()
            
            if overallResult['isFake'] : 
                print("결과 : 조작된 카카오톡 대화창입니다")
                insert_data['manipulated'] = "true"
                
                if overallResult['reason'] == 'notLinedUp' :
                    print("근거 : 카카오톡 대화창이 바르게 정렬되지 않았습니다.") 
                    insert_data['reason'] = "notLinedUp"
                elif overallResult['reason'] == 'fakeApp' :
                    print("근거 : 카카오톡 조작어플(톡썰메이커)가 사용된 흔적을 발견했습니다.")
                    insert_data['reason'] = "fakeApp"
            elif not useImageEditor : 
                print("결과 : 편집 흔적이 발견되지 않음")
                print("근거 : 편집 프로그램을 사용하거나 이미지를 조작한 흔적을 찾을 수 없습니다")
                insert_data['edited'] = "false"
                insert_data['reason'] = "none"

            elif useImageEditor  : 
                print("결과 : 편집흔적 발견")
                print("근거 : 다음 프로그램 사용 흔적 발견 - ", useImageEditor)
                insert_data['edited'] = "true"
                insert_data['reason'] = "useprogram"
                insert_data['programNames'] = useImageEditor
            
            print("-------------------------------")
            insert_data['state']='등록완료'
            collection.update_one({'_id':ObjectId(_id.inserted_id)},{"$set":insert_data})
            os.remove("./test")
            
        return {"result":"success"}
    else:
        return {"result":"error"}

@app.route('/loadArtifactFile',methods=['GET','POST'])

def loadArtifactFile():  
    idx=0
    return_data={}
    f=request.files['file']
    data_list=[]
    data=f.stream.read()
    stream=io.StringIO(data.decode("cp949"),newline=None)
    field=['Type','Timestamp','Name','Desc','Icon','Labeling','path','isChecked']
    # if(check_csv.check_csv(stream)=="verified fail"):
    #     return_data['res']="verified fail"
    #     return_data['data']=[]
    #     return json.dumps(return_data,default=json_util.default)

    f.seek(0)
    data=f.stream.read()
    csv_data=io.StringIO(data.decode("cp949"),newline=None)
    reader=csv.DictReader(csv_data,field)
    tmp=0
    for row in reader:
        if(tmp>3):
            row['isChecked']="false"
            row['Labeling']=str(row['Labeling']).split("/")
            row['Timestamp']=str(row['Timestamp'].replace("/","T"))
            data_list.append(row)
        tmp=tmp+1
    
    data_list.sort(key=lambda x: x['Timestamp'])
    for list in data_list:
        list['index']=idx
        idx=idx+1
    return_data['data']=data_list
    return json.dumps(return_data,default=json_util.default)

# @app.route('/uplaodArtifact',methods=['GET','POST'])
# def uploadArtifact():
#     import hashlib
#     import time
#     import os
#     from werkzeug.datastructures import FileStorage
#     conn =pymongo.MongoClient(config.mongodb)
#     db = conn.jb_db
#     now=time.localtime()
#     collection = db.stt

#     data=request.form["data"]
#     case_num=request.form["case_num"]
#     user=request.form["user"]


#     insert_data={}
#     insert_data['state']='변환완료'              
#     insert_data['filetype']='컴퓨터 증거'
#     insert_data['casenum']=case_num
#     insert_data['filename']=filename
#     insert_data['hashed_filename']=hashed_filename
#     insert_data['user_id']=user
#     insert_data['data']=data
#     insert_data['index']=collection.find({'user_id':user}).count()+1
#     time="%04d-%02d-%02d %02d:%02d:%02d"% (now.tm_year, now.tm_mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec)
#     insert_data['uploaded_time']=str(time)

    
    
@app.route('/textEdit',methods=['GET','POST'])
def textEdit():
    conn=pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.stt

    data = request.get_json()
    if(data):
        editData=data['editData']
        _id=data['_id']
        collection.update_one({'_id':ObjectId(_id)},{"$set":{"segments":editData}})

@app.route('/loadArtifact',methods=['GET','POST'])
def loadArtifact():
    return_res=[]
    conn=pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.stt
    data = request.get_json()
    print(data)
    if(data):        
        res=collection.find_one({'_id':ObjectId(data['_id'])})        
        return json.dumps(res, default=json_util.default)

@app.route('/isCheckedUpdate',methods=['GET','POST'])
def isCheckedUpdate():
    conn=pymongo.MongoClient(config.mongodb)
    db=conn.jb_db
    collection=db.stt
    insert_data = {}

    data=request.get_json()
    if(data):
        time_list=[]
        # print(data['isCheckedUpdate'])
        for i in data['isCheckedUpdate']:
            if(i['isChecked']=="true"):
                time_list.append(i["Timestamp"])
        start_time=time_list[0].split("T")[0]
        end_time=time_list[-1].split("T")[0]
        if(start_time==end_time):
            insert_data["date"]=start_time
        else:
            insert_data["date"]=start_time+" ~ "+end_time
            
        
        insert_data["data"]=data['isCheckedUpdate']
        insert_data["attacker"]=data['attacker']
        insert_data["desc"]=data['description']
        insert_data["type"]=data['type'].split(" ")
        insert_data["casenum"]=data["casenum"]
        insert_data["user_id"]=data["user"]
        insert_data["filetype"]=data["filetype"]
        insert_data["filename"]=data["filename"]+"_"+data["type"]
        insert_data["state"]="등록완료"
        insert_data["workStartTime"]=data["work_startTime"]
        insert_data["holiday_date"]=data["holiday_date"]
        insert_data["parental_date"]=data["parental_date"]
        insert_data["workEndTime"]=data["work_endTime"]
        insert_data['index']=collection.find({'user_id':data["user"]}).count()+1

        # if(_id):
        #     collection.update_one({'_id':ObjectId(_id)},{"$set":{"data":isCheckedUpdate,"attacker":attacker,"desc":description,"type":type}})
        id=collection.insert_one(insert_data)
        return json.dumps(id.inserted_id,default=json_util.default)

@app.route('/ArtifactAnalysis',methods=['GET','POST'])
def ArtifactAnalysis():
    conn=pymongo.MongoClient(config.mongodb)
    db=conn.jb_db
    collection=db.stt
    data=request.get_json()
    checkedTrue=[]
    _id=data["_id"]
    type=data["type"]
    for i in data["isCheckedUpdate"]:
        if(i["isChecked"]=="true"):
            checkedTrue.append(i)
    
    programList=[]
    documentList=[]
    webList=[]

    print(data)
    print(data["work_startTime"])
    for i in checkedTrue:
        if(i["Type"]=="프리패치"):
            programList.append(i["Name"])
        elif(i["Desc"]=="문서 열람" or i["Desc"]=="파일 열람"):
            documentList.append(i["Name"])
        elif(i["Type"]=="웹 히스토리"):
            webList.append(i["Name"])
    try:
        attackerStr=",".join(data["attacker"])
    except:
        attackerStr=""
    try:
        programListStr=",".join(programList)
    except:
        programListStr=""
    try:
        documentListStr=",".join(documentList)
    except:
        documentListStr=""
    try:
        webListStr=",".join(webList)
    except:
        webListStr=""
    
    logged_in=""
    for i in checkedTrue:
        if(i["Desc"]=="컴퓨터 로그인 성공"):
            logged_in=i["Timestamp"].replace("T"," ")
        

    if(type=="초과근무"):
        artifactAnalysis=attackerStr+"에게 야근(주말) 출근을 강요당했습니다.\n"+"저의 정규 근무시간은 "+data["work_startTime"]+" ~ "+data["work_endTime"]+"이지만, "+checkedTrue[-1]["Timestamp"].split("T")[-1]+"까지 초과근무를 하였습니다.\n"+"초과근무 당시, "+programListStr+" 프로그램을 사용했습니다.\n"+documentListStr+" 작업을 했으며, "+webListStr+" 에 접속한 사실이 있습니다."
    elif(type=="사적지시"):
        artifactAnalysis=attackerStr+"가 사적인 일을 지시하여 업무와 무관한 일을 하게 되었습니다.\n"+"사적 지시로 인해, 업무와 관련 없는"+programListStr+"프로그램을 사용하게 되었습니다.\n"+"또한, "+documentListStr+"작업을 했으며,"+webListStr+" 에 접속한 사실이 있습니다."
    elif(type=="전가"):
        artifactAnalysis=attackerStr+"가 본인의 업무를 저에게 반복적으로 전가하였습니다. 저는 총 "+len(documentList)+"개의 업무를"+attackerStr+"대신 하게 되었습니다.\n"+"업무 전가로 인해, "+programListStr+" 프로그램을 사용하게 되었습니다.\n"+"또한,"+documentListStr+" 작업을 했으며,"+webListStr+" 에 접속한 사실이 있습니다."
    elif(type=="SNS"):
        artifactAnalysis=attackerStr+"가 전화 및 온라인으로 근무 시간 외에 업무를 지시하였습니다.\n"+"저의 정규 근무시간은 "+data["work_startTime"]+" ~ "+data["work_endTime"]+"이지만, "+checkedTrue[-1]["Timestamp"].split("T")[-1]+"까지 초과근무를 하였습니다.\n"+"초과근무 당시, "+programListStr+" 프로그램을 사용했습니다.\n"+documentListStr+" 작업을 했으며, "+webListStr+" 에 접속한 사실이 있습니다."
    elif(type=="건의"):
        artifactAnalysis=attackerStr+"가 저의 건의 사항과 의견을 일방적으로 무시하였습니다.\n"+documentListStr+" 문서를 작성하여 "+attackerStr+" 에게 건의했지만, 건의사항이 무시당했습니다.\n"+webListStr+" 에 건의사항을 작성한 사실이 있습니다"
    elif(type=="행사"):
        artifactAnalysis=attackerStr+" 에 의해 체육대회(단합대회)의 비업무적인 행사에 참여하도록 강요당했습니다.\n"+"행위자는 행사 참여를 강요하도록"+webListStr+" 링크와 "+documentListStr+" 를 저에게 전달하여 행사 참여를 강요한 사실이 있습니다."
    elif(type=="장기자랑"):
        artifactAnalysis=attackerStr+" 에 의해 장기자랑에 참여하도록 강요당했습니다.\n"+attackerStr+" 는 장기자랑 참여를 강요하도록 "+webListStr+" 링크와 "+documentListStr+" 를 저에게 전달하여 장기자랑 참여를 강요한 사실이 있습니다."
    elif(type=="후원"):
        artifactAnalysis=attackerStr+" 에 의해 후원을 강요당했습니다.\n"+attackerStr+" 는"+webListStr+" 링크와 "+documentListStr+" 를 저에게 전달하여 후원을 강요한 사실이 있습니다."
    elif(type=="모임"):
        artifactAnalysis=attackerStr+" 에 의해 동호회나 모임 가입을 강요당했습니다."+attackerStr+" 는 "+webListStr+" 링크와 "+documentListStr+" 를 저에게 전달하여 모임을 강요한 사실이 있습니다."
    elif(type=="휴가"):
        artifactAnalysis=attackerStr+" 가 휴가,병가,복지 혜택을 사용하지 못하게 했습니다.\n"+"실제로 저는 "+data["holiday_date"]+" 에 휴가를 냈음에도, "+logged_in+" 부터 "+programListStr+" 를 사용하고 "+documentListStr+" 문서를 작성한 사실이 있습니다."
    elif(type=="육아휴직"):
        artifactAnalysis=attackerStr+" 가 육아휴직을 사용하지 못하게 했습니다.\n"+data["parental_date"]+" 에 육아 휴직계를 냈음에도 "+logged_in+" 부터 "+programListStr+" 를 사용하고 "+documentListStr+" 문서를 작성한 사실이 있습니다."
    elif(type=="성희롱"):
        artifactAnalysis=attackerStr+" 가 성적 수치심을 주며 정신적 피해를 입혔습니다.\n"+documentListStr+" 의 성적 수치심을 주는 사진을 전달하거나 "+webListStr+" 의 링크를 전달한 사실이 있습니다."
    
    collection.update_one({'_id':ObjectId(_id)},{"$set":{"artifactAnalysis":artifactAnalysis}})
    return "success"

@app.route('/EditArtifactReport',methods=['GET','POST'])
def EditArtifactReport():
    conn=pymongo.MongoClient(config.mongodb)
    db=conn.jb_db
    collection=db.stt
    data=request.get_json()

    _id=data["_id"]["$oid"]
    desc=data["desc"]

    collection.update_one({'_id':ObjectId(_id)},{"$set":{"desc":desc}})
    print(data)

    return "success"

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
    segments[0]['isChecked']=False
    for i in range(len(o_segments)-1):
        if(o_segments[i]['speaker']['name']==o_segments[i+1]['speaker']['name']):
            segments[t]['stt']+=o_segments[i+1]['text']        
        else:
            t=t+1
            speaker_data={}
            speaker_data['speaker']=o_segments[i+1]['speaker']['name']
            speaker_data['stt']=o_segments[i+1]['text']
            speaker_data['isChecked']=False
            segments.append(speaker_data)    
    collection.update(o_query,{"$set":{'segments':segments}})
    collection.update(o_query,{"$set":{'text':data['text']}})
    collection.update(o_query,{"$set":{'state':"등록완료"}})
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

@app.route('/makereport')
def makereport():
    return render_template('index.html')

@app.route('/printreport')
def printreport():
    return render_template('index.html')

@app.route('/showreport')
def showreport():
    return render_template('index.html')

@app.route('/allevidence')
def allevidence():
    return render_template('index.html')

@app.route('/mainbullying')
def mainbullying():
    return render_template('index.html')

@app.route('/overview')
def overview():
    return render_template('index.html')

@app.route('/main')
def main():
    return render_template('index.html')

@app.route('/checklist')
def checklist():
    return render_template('index.html')

@app.route('/aboutus')
def aboutus():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('index.html')

@app.route('/bullyingtypepage')
def bullyingtypepage():
    return render_template('index.html')

@app.route('/evidencedetails')
def evidencedetails():
    return render_template('index.html')
@app.route('/attackertypepage')
def attackertypepage():
    return render_template('index.html')

@app.route('/pictureevidence')
def pictureevidence():
    return render_template('index.html')

@app.route("/uploadevidence_artifact")
def uploadevidence_artifact():
    return render_template('index.html')

@app.route('/getallevidence', methods=['GET','POST'])
def getallevidence():
    conn=pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.stt

    data = request.get_json()
    user = data['user']
    type = data['type']
    
    if type=="all":

        evidences = list(collection.find({'user_id':user}))
        evidences.sort(key=lambda x:x['date'])

        return json.dumps(evidences,default=json_util.default)
    elif type == "record":
        print(user)
        
        evidences=list(collection.find({
                "$and":[
                    {'user_id':user},
                    {'filetype':"녹음 파일"},
                ]
                }))
        evidences.sort(key=lambda x:x['date'])

        return json.dumps(evidences,default=json_util.default)
    elif type == "picture":
        evidences=list(collection.find({
                "$and":[
                    {'user_id':user},
                    {'filetype':"사진 파일"},
                ]
                }))
        evidences.sort(key=lambda x:x['date'])

        return json.dumps(evidences,default=json_util.default)


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

        insert_data['requirement']={"seperate":False,"personnel":False,"agree":False,"paidleave":False,"etc":False,"etcstr":""}
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
    attacker = request.form['attacker'].split(",")
    types = request.form['type'].split(",")
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

@app.route("/evidenceupdate_artifact",methods=['GET','POST'])
def evidenceupdate_artifact():
    conn=pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.stt
    data = request.get_json()

    time_list=[]
    # print(data['isCheckedUpdate'])
    for i in data['isCheckedUpdate']:
        if(i['isChecked']=="true"):
            time_list.append(i["Timestamp"])
    try:
        start_time=time_list[0].split("T")[0]
    except:
        pass
    try:
        end_time=time_list[-1].split("T")[0]
    except:
        pass
    if(start_time==None and end_time==None):
        start_time,end_time="",""
    else:
        if(start_time==end_time):
            date=start_time
        else:
            date=start_time+" ~ "+end_time

    _id=data["_id"]
    updated_artifact_list=data['isCheckedUpdate']
    desc=data["desc"]
    attacker=data["attacker"]
    type=data["type"]
    original_filename=data["filename"].split("_")[0]
    filename=original_filename+"_"+str(data["type"])
    collection.update_one({'_id':ObjectId(_id)},{"$set":{"data":updated_artifact_list,"desc":desc,"attacker":attacker,"date":date,"type":type,"filename":filename}})

    return "success"

@app.route("/load_s3_image",methods=['GET','POST'])
def load_s3_image():
    import base64
    url=request.get_json()["url"]
    print(url)
    response=requests.get(url)

    pass_string=request.get_json()["key"]
    #pass_string은 사용자가 입력한 비밀번호 값

    pass_string_bytes=bytes(pass_string,'utf-8')
    values=bytes(response.content)

    cipher=pass_string_bytes*(len(values)//len(pass_string_bytes))+pass_string_bytes[:len(values)%len(pass_string_bytes)]

    plaindata=bytes(p^k for p,k in zip(values,cipher))

    
    # with open("ress.png","wb") as file:
    #     file.write(plaindata)
    # return send_file(io.BytesIO(plaindata),mimetype='image/png',as_attachment=True,environ=request.environ,download_name="test.png")

    return({"res":(base64.b64encode(plaindata)).decode('utf-8')})

@app.route("/convertKeyHash",methods=['GET','POST'])
def convertKeyHash():
    print(request.get_json()["key"])

    m = hashlib.sha256()
    m.update(request.get_json()["key"].encode('utf-8'))
    print(m.hexdigest())


    return({"response":m.hexdigest()})

@app.route("/ismainevdi",methods=['GET','POST'])
def ismainpic():
    conn=pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.stt
    data = request.get_json()
    
    pic_main = []
    aud_main = []
    
    mainevdi = list(collection.find({
        "$and":[
            {'user_id':data['user']},
            {'ismain': "yes"}
        ]
    }))
    
    for i in mainevdi:
        if i['filetype'] == "사진 파일":
            pic_main.append(i)
            print(pic_main)
        elif i['filetype'] == "녹음 파일":
            print(aud_main)
            
    if data['type'] == "pic":
        return json.dumps(pic_main,default=json_util.default)
    elif data['type'] == "aud":
        return json.dumps(aud_main,default=json_util.default)
    elif data['type'] == "all":
        return json.dumps(mainevdi,default=json_util.default)
    else:   
        return render_template("index.html")
    
@app.route("/csvevdi",methods=['GET','POST'])
def csvevdi():
    conn=pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.stt
    data = request.get_json()
    
    csvevdi = list(collection.find({
        "$and":[
            {'user_id':data['user']},
            {'filetype': "컴퓨터 증거"}
        ]
    }))
    
    return json.dumps(csvevdi,default=json_util.default)

@app.route("/bullyingtype",methods=['GET','POST'])
def bullyingtype():
    conn=pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.stt
    data = request.get_json()
    evidences = list(collection.find({'user_id':data['user']}))
    evidences.sort(key=lambda x:x['date'])
    
    bul_type = []
    
    for e in evidences:
        a = e['type']
        for bul in a:
            bul_type.append(bul)
    
    print(bul_type)
    bul_type_unq = set(bul_type)
    bul_type = list(bul_type_unq)
    
    return json.dumps(bul_type,default=json_util.default)

@app.route("/bullyingtimeline",methods=['GET','POST'])
def bullyingtimeline():
    import pandas as pd
    import numpy as np
    
    conn=pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.stt
    data = request.get_json()
    
    evid = list(collection.find({
        "$and":[
            {'user_id':data['user']},
            {'type': data['type']}
        ]
    }))
    
    evid.sort(key=lambda x:x['date'])
    
    if data['scatter'] == 'yes':
        df = pd.DataFrame(evid)
        df2 = df[['date']]
        # df2['y'] = df2.groupby(['date']).col.transform('count')
        df2['y'] = df2.count(axis = 1)
        df2.rename(columns = {'date' : 'x'}, inplace = True)
    
        js = df2.to_json(orient='records')

        return js
        
    return json.dumps(evid,default=json_util.default)

@app.route("/attackertype",methods=['GET','POST'])
def attackertype():
    conn=pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.stt
    data = request.get_json()
    
    evidences = list(collection.find({'user_id':data['user']}))
    evidences.sort(key=lambda x:x['date'])
    
    att_type = []
    
    for e in evidences:
        a = e['attacker']
        for att in a:
            att_type.append(att)
    
    print(att_type)
    att_type_unq = set(att_type)
    att_type = list(att_type_unq)
    
    return json.dumps(att_type,default=json_util.default)

@app.route("/attackertimeline",methods=['GET','POST'])
def attackertimeline():
    import pandas as pd
    import numpy as np
    
    conn=pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.stt
    data = request.get_json()
    
    evid = list(collection.find({
        "$and":[
            {'user_id':data['user']},
            {'attacker': data['type']}
        ]
    }))
    
    evid.sort(key=lambda x:x['date'])
    
    if data['scatter'] == 'yes':
        df = pd.DataFrame(evid)
        # df2 = df[['date']]
        # df2['y'] = df2.groupby(['date']).col.transform('count')

        # df2['y'] = df2.count(axis = 1)
        # df2.rename(columns = {'date' : 'x'}, inplace = True)
    
        # js = df2.to_json(orient='records')
        # js2 = df3.to_json(orient='records')
        # print(js)
        # print(js2)
        
        df3 = df[['date']]
        df33 = df3.groupby(['date'])
        df33 = df33.size().reset_index(name='y')
        df333 = pd.DataFrame(df33)
        df333.rename(columns = {'date' : 'x'}, inplace = True)        
        js2 = df333.to_json(orient='records')
        
        return js2
        
    return json.dumps(evid,default=json_util.default)

@app.route("/loadCaseInfo",methods=["GET","POST"])
def loadCaseInfo():
    conn=pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.case
    data = request.get_json()
    _id=data["case_id"]
    print(_id)

    caseInfo = list(collection.find({'_id':ObjectId(_id)}))

    return json.dumps(caseInfo,default=json_util.default)

@app.route("/updateCaseRequirement",methods=["GET","POST"])
def updateCaseRequirement():
    conn=pymongo.MongoClient(config.mongodb)
    db = conn.jb_db
    collection = db.case
    data=request.get_json()
    print(data)
    if(data["mode"]=="checked"):
        print("mode_checked")
        requirement=data["requirement"]
        _id=data["case_id"]
        collection.update_one({'_id':ObjectId(_id)},{"$set":{"requirement":requirement}})

    elif(data["mode"]=="etcstr"):
        print("mode_etcstr")
        _id=data["case_id"]
        collection.update_one({'_id':ObjectId(_id)},{"$set":{"requirement.etcstr":data["etcstr"]}})

    return "success"

@app.route('/editEvidenceDetail',methods=['GET','POST'])
def editEvidenceDetail():
    conn=pymongo.MongoClient(config.mongodb)
    db=conn.jb_db
    collection=db.stt
    data=request.get_json()

    _id=data["_id"]["$oid"]
    desc=data["desc"]

    collection.update_one({'_id':ObjectId(_id)},{"$set":{"desc":desc}})
    print(data)

    return "success"

@app.route("/editSTTReport",methods=['GET','POST'])
def editSTTReport():
    conn=pymongo.MongoClient(config.mongodb)
    db=conn.jb_db
    collection=db.stt
    data=request.get_json()
    print(data)
    _id=data["_id"]
    segments=data["segments"]

    collection.update_one({'_id':ObjectId(_id)},{"$set":{"segments":segments,"choosedOnReport":True}})
    print(data)
    return "success"

if __name__=='__main__':
 app.run(host='0.0.0.0', port=5000, debug=True)

# if __name__=='__main__':
#  app.run(host='0.0.0.0', port=80, debug=True)
