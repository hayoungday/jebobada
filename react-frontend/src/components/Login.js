import React, {useState, useEffect} from 'react';
import Header from './Header';
import './login.css';
import { Link} from 'react-router-dom';
import { KAKAO_AUTH_URL } from "./config"
import KaKaoLogin from 'react-kakao-login'
import styled from 'styled-components';
import axios from 'axios';
import { Cookies } from "react-cookie"



const Login = ({history}) => {

    const cookies = new Cookies()

    const [local_id, setId] = useState("")
    const [password, setPassword] = useState("")

    
    const onIdHandler = (event) => {
        setId(event.currentTarget.value)
    }
 
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();

        let body = {
            user_id: local_id,
            user_pwd: password,
            // user_pwd2: userpassword2
        }

        axios
        .post("/login",body)
        .then(res =>{
            if (cookies.get('logined')){
                alert("hi")
                history.push('/')
            } else {
                alert("아이디 및 비밀번호를 다시 확인해주세요")
            }
        })

    }
    return(
        <div>
            <Header/>

            <div id="content" class="identify">
                <div class="content-primary">
                    <div class="content-top">
                        {/* <h2>로그인</h2>
                        <p class="summary">로그인을 하시면 Best of the Best 홈페이지를 더욱 편리하게 이용하실 수 있습니다. </p> */}
                    </div>
            <div class="login-box">
            
                <div class="login">
                    {/* <form action="https://www.kitribob.kr/accounts/auth/login/get" id="form_get" name="form_get" autocomplete="off" data_type="json" onsubmit="return false" method="post" accept-charset="utf-8"> */}
                    <form onSubmit={onSubmitHandler}>
                        <fieldset class="fieldset">
                            {/* <legend>로그인</legend> */}
                            <div class="field">
                                <div class="label"><label for="name">아이디</label></div>
                                <div class="insert">
                                    <input type="text" id="local_id"  placeholder="아이디를 입력하세요." onChange={onIdHandler}/>
                                </div>
                            </div>
                            <div class="field">
                                <div class="label"><label for="password">비밀번호</label></div>
                                <div class="insert">
                                    <input type="password" id="password" placeholder="비밀번호를 입력하세요." onChange={onPasswordHandler}/>
                                </div>
                            </div>
                        </fieldset>
                        <div class="id-save">
                            <input type="checkbox" name="save_id" id="save_id" value="1"/>
                            <label for="save_id">아이디 저장</label>
                        </div>
                        {/* <button type="submit" data-type="ajax_form_submit" data-form="form_get" data-callback="login.after_submit" class="btn large weighty">로그인</button> */}
                        <button class="btn large weighty">로그인</button>
                    </form>
                    
                </div>
                <button><Link to="/signup">회원가입</Link></button>
                </div>
                    <KaKaoBtn> <a href={KAKAO_AUTH_URL}>
	                    <span>카카오계정 로그인</span>
                        </a>
                    </KaKaoBtn>
                </div>
            </div>
        </div>
        
        
    )
}

const KaKaoBtn = styled(KaKaoLogin)`
  padding: 0;
  width: 300px;
  height: 45px;
  line-height: 44px;
  color: #783c00;
  background-color: #ffeb00;
  border: 1px solid transparent;
  border-radius: 3px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0px 15px 0 rgba(0, 0, 0, 0.2);
  }
`;

export default Login;