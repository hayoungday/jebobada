import React, { Component } from 'react';
import PropTypes from 'prop-types'
import styled from 'styled-components'
import './Agree.css';


function Agree_Modal({ className, visible, children, agreeButton }) {
    
    const Agree = () => {
        return(
            <div className="flex-column-container-agree">
              <span className="agree-title">개인정보 수집 및 이용 동의</span>
              <div className="agreement">
                <span className="agreement-title">개인정보 수집 항목 및 방법</span>
                <span className="agreement-contents">
                  JEBOBADA는 직장 내 괴롭힘 피해자 구제를 위하여 증거물로부터 최소한의 범위 내에서 개인을 식별할 수 있는 정보를 수집할 수 있습니다.
                  수집하는 정보는 개인이 등록한 음성 및 이미지 증거 내의 개인 식별 가능 정보입니다.
                </span>
                <span className="agreement-title">개인정보 수집 및 이용목적</span>
                <span className="agreement-contents">
                  개인정보의 수집 및 이용목적은 개인이 필요 시 증거물 상세 확인, 수정 및 삭제 등의 처리를 위함입니다.
                </span>
                <span className="agreement-title">개인정보의 처리 및 보유 기간</span>
                <span className="agreement-contents">
                  JEBOBADA 시스템을 통해 수집된 개인정보는 개인의 요청 직후 1주일 이내에 파기하는 것을 원칙으로 합니다.
                </span>
              </div>
              <button onClick={agreeButton} className="agree-button-container">동의</button>
            </div>
        )
    }

    return (
      <>
        <ModalOverlay visible={visible} />
        <ModalWrapper className={className} tabIndex="-1" visible={visible}>
          <ModalInner tabIndex="0" className="modal-inner">
            {children}
            {Agree()}
          </ModalInner>
        </ModalWrapper>
      </>
    )
  }
  
  Agree_Modal.propTypes = {
    visible: PropTypes.bool,
    agreeButton: PropTypes.func,
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
    transition: "all.5s ease"
  `
  
  const ModalInner = styled.div`
    box-sizing: border-box;
    position: relative;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
    background-color: #fff;
    border-radius: 20px;
    width: 1000px;
    height: 600px;
    top: 50%;
    transform: translateY(-50%);
    margin: 0 auto;
    padding: 40px 20px;
    transition: "all.5s ease"
  `

export default Agree_Modal;