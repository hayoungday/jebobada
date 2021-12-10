import React, { Component, useState } from 'react';
import PropTypes from 'prop-types'
import "./login.css";
import "./Main.css"
import Signup_Modal from './Signup_Modal';

import { Link } from "react-router-dom";
import { KAKAO_AUTH_URL } from "./config";
import KaKaoLogin from "react-kakao-login";
import styled from "styled-components";
import axios from "axios";
import { Cookies } from "react-cookie";
import { withRouter } from 'react-router-dom'
import KakaoLogin from 'react-kakao-login';

function Login_Modal({ className, visible, children, closeModal, openModal }) {

  const cookies = new Cookies();

  const [local_id, setId] = useState("");
  const [password, setPassword] = useState("");

  const [isSignupModalOpen,setIsSignupModalOpen] = useState(false)

  const closeSignupModal=()=>{
    setIsSignupModalOpen(false)
  }

  const onIdHandler = (event) => {
    setId(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    let convert = {
      key: password,
    };
    axios.post("/convertKeyHash", convert).then((res) => {
      localStorage.setItem('key',res.data.response)
    });

    let body = {
      user_id: local_id,
      user_pwd: password,
      // user_pwd2: userpassword2
    };

    axios.post("/login", body).then((res) => {
      if (cookies.get("logined")) {
        window.location.replace("/");
      } else {
        alert("아이디 및 비밀번호를 다시 확인해주세요");
        // window.location.replace("/main");
      }
    });
  };
  const modal_contents = () => {
  return (
    <div>
        <button className="close_icon_login" onClick={closeModal}/>
        <span className="login_text">로그인</span>
        <form onSubmit={onSubmitHandler}>
          <div className="form_id">
            <div className="id_icon_login"/>
            <input type="text" className="login_input_css" placeholder="아이디를 입력하세요" onChange={onIdHandler}/>
          </div>
          <div className="form_id">
            <div className="pw_icon_login"/>
            <input type="password" className="login_input_css" placeholder="비밀번호를 입력하세요." onChange={onPasswordHandler} />
          </div>
            <button className="login_button_box">
                로그인
            </button>
        </form>
        <a href = {KAKAO_AUTH_URL}>
            <div className="kakao_login_medium_wide"/>
        </a>

        <span className="signup_button_box">
          아직 회원이 아니신가요?
          <button className="signup_text_login" onClick={()=>{closeModal();openModal();}}>회원가입</button>
        </span>

        <span className="login_jebobada_text">
          JeBoBADA
        </span>

     </div>
  );
    }

    return (
      <>
        <ModalOverlay visible={visible} />
        <ModalWrapper className={className} tabIndex="-1" visible={visible}>
          <ModalInner tabIndex="0" className="modal-inner">
            {children}
            {modal_contents()}
          </ModalInner>
        </ModalWrapper>
      </>
    )
  }
  
  Login_Modal.propTypes = {
    visible: PropTypes.bool,
    type : PropTypes.string,
    closeModal : PropTypes.func,
    openModal : PropTypes.func,
  }
  
  const ModalWrapper = styled.div`
    box-sizing: border-box;
    display: ${(props) => (props.visible ? 'block' : 'none')};
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    overflow: auto;
    outline: 0;
  `
  
  const ModalOverlay = styled.div`
    box-sizing: border-box;
    display: ${(props) => (props.visible ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 999;
  `
  
  const ModalInner = styled.div`
    box-sizing: border-box;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    margin: 0 auto;
    padding: 40px 20px;

    width: 490px;
    height: 500px;
    padding: 48px 49px 53px;
    border-radius: 8px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    border: solid 1px #707070;
    background-color: #fff;
  `

export default Login_Modal;