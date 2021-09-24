from weakref import ProxyTypes
from flask import Flask, render_template,request, redirect, jsonify, make_response
import pymongo
import requests
# import bcrypt
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, set_access_cookies, set_refresh_cookies, unset_jwt_cookies, create_refresh_token

app = Flask("__main__")
app.config['JWT_SECRET_KEY']="BLABLA"
app.config['JWT_TOKEN_LOCATION']=['cookies']
app.config['JWT_COOKIE_SECURE']=False
app.config['JWT_COOKIE_CSRF_PROTECT']=True
app.config['JWT_ACCESS_TOKEN_EXPIRES']=30
app.config['JWT_REFRESH_TOKEN_EXPIRES']=100
app.config['BCRYPT_LEVEL']=10

jwt = JWTManager(app)
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
    conn =pymongo.MongoClient('127.0.0.1',27017) #환경변수 ㄱ 
    # conn =pymongo.MongoClient('218.146.20.51',27017)

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
            return jsonify({'result':'input_all'})
        # elif password != re_password:
        #     return jsonify({'result':'check_pwd'})
        else:
            collection.insert_one(userinfo)
            return jsonify({'result':'success','msg':'register'})
        

@app.route("/signup/check",methods=['GET'])
def check_id():
    userid = request.form.get('userid')
    checking = db.user.find_one({'userid':userid})
    if checking is not None:
        return jsonify({'result':'fail','msg':'already existed'})

@app.route("/oauth",methods=['GET','POST'])
def oauth():
    conn =pymongo.MongoClient('127.0.0.1',27017) #환경변수 ㄱ
    # conn =pymongo.MongoClient('218.146.20.51',27017)

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
    
@app.route('/remove')
def token_remove():
    resp=jsonify({'result':True})
    unset_jwt_cookies(resp)
    resp.delete_cookie('logined')
    return resp

@app.route('/login',methods=['GET','POST'])
def login():
    conn =pymongo.MongoClient('127.0.0.1',27017) #환경변수 ㄱ
    # conn =pymongo.MongoClient('218.146.20.51',27017)

    db = conn.jb_db
    collection = db.user

    data = request.get_json()
    if(data):
        user_id = data['user_id']
        user_pwd =  generate_password_hash(data['user_pwd'])

        user = collection.find_one({'user_nickname':user_id},{'user_pwd':user_pwd})
                
        if user is None:
            return jsonify({'login':False})
        else:
            resp = make_response(render_template("index.html"))
            access_tk = create_access_token(identity=user_id)
            refresh_tk = create_refresh_token(identity=user_id)
            resp.set_cookie("logined", "true")
            set_access_cookies(resp,access_tk)
            set_refresh_cookies(resp,refresh_tk)
            return resp   

app.run(debug=True)

# if __name__=='__main__':
#  app.run(host='0.0.0.0', port=80, debug=True)