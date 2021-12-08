import React, { Component, useState } from 'react';
import PropTypes from 'prop-types'
import "./login.css";
import { Link } from "react-router-dom";
import { KAKAO_AUTH_URL } from "./config";
import KaKaoLogin from "react-kakao-login";
import styled from "styled-components";
import axios from "axios";
import { Cookies } from "react-cookie";
import { withRouter } from 'react-router-dom'
import KakaoLogin from 'react-kakao-login';

function Signup_Modal({ className, visible, children, closeModal }) {

  
    const [userid, setId] = useState("");
    const [userpassword, setPassword] = useState("");
    const [userpassword2, setPassword2] = useState("");
  
    const onIdHandler = (event) => {
      setId(event.currentTarget.value);
    };
  
    const onPasswordHandler = (event) => {
      setPassword(event.currentTarget.value);
    };
  
    const onPasswordCheckHandler = (event) => {
      setPassword2(event.currentTarget.value);
    };
  
    /*signup.js*/
  
    const onSubmitHandler = (event) => {
      event.preventDefault();
  
      let body = {
        user_id: userid,
        user_pwd: userpassword,
        user_pwd2: userpassword2,
      };
  
      axios.post("/signup", body).then((res) => {
        if (res.data.result == "success") {
          alert("회원가입 완료");
          window.location.replace("/main");
        } else if (res.data.result == "input_all") {
          alert("모두 다 기입해주세요");
        } else {
          alert("비밀번호를 다시 확인해주세요");
        }
      });
    };
  
    const onButtonClick = (event) => {
        event.preventDefault();
  
        let body = {
            user_id: userid
        }
  
        axios.post("/check_double", body).then((res)=> {
            if(res.data.result == "success"){
                console.log(res.data.result)
                alert("사용 가능한 ID 입니다.")
            }
            else if (res.data.result == "fail"){
                alert("이미 존재하는 ID 입니다.")
                console.log(res.data.result)
                setId("");
            }
        })
    }

  const modal_contents = () => {
  return (
    <div>
        <button className="close_icon_login" onClick={closeModal}/>
        <span className="signup_text">회원가입</span>
        
        <form onSubmit={onSubmitHandler}>
        
        <div className="flex-container-signup">
          <div className="signup_id">
            <div className="id_icon_login"/>
            <input type="text" className="login_input_css" id="userid" value={userid} placeholder="아이디를 입력하세요." onChange={onIdHandler}/>
          </div>
            <button className="signup_chkid_box" onClick={onButtonClick}>
                중복체크
            </button>
        </div>
        
        <div className="signup_pw">
          <div className="pw_icon_login"/>
          <input type="password" className="login_input_css" id="password" value={userpassword} placeholder="비밀번호를 입력하세요." onChange={onPasswordHandler}/>
        </div>
        
        <div className="signup_pw">
          <div className="pw_icon_login"/>
          <input type="password" className="login_input_css" id="re_password" value={userpassword2} placeholder="비밀번호를 확인해주세요." onChange={onPasswordCheckHandler} />
        </div>

        <button className="signup_button_box_a">
            회원가입
        </button>
        </form>

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
  
  Signup_Modal.propTypes = {
    visible: PropTypes.bool,
    type : PropTypes.string,
    closeModal : PropTypes.func,
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
    padding: 40px 40px;

  width: 489px;
  height: 473px;
  border-radius: 8px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #707070;
  background-color: #fff;
  `

export default Signup_Modal;