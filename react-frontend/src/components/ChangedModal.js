import React, { Component } from 'react';
import PropTypes from 'prop-types'
import styled from 'styled-components'

function ChangedModal({ className, visible, children, type, closeModal }) {

    const modal_contents = (type) => {
        if(type=="녹음 파일"){
            return(
                <>
                    <button className="close_icon_postview" onClick={closeModal}/>                  
                    <div className="flex-container-column-meta">
                      <span className="info_modify">편집 정보</span>
                      <span className="help_text">
                        편집 프로그램 사용 및 내용 짜깁기 등을 탐지하여
                      </span>
                      <span className="help_text">
                        녹음 파일이 가공되었는지 확인합니다.
                      </span>
                      <br/>
                      <div className="flex-container-meta">
                        <span className="info_modify_text">편집 여부</span>
                        <span className="info_modify_container1">편집이 의심됩니다.</span>
                      </div>
                      <div className="flex-container-meta">
                        <span className="info_modify_text">판단 이유</span>
                        <span className="info_modify_container2">음성 파일 내에서 조작으로 의심되는 부자연스러운 지점이 발견되었습니다.</span>
                      </div>
                    </div>      
                </>
            )
        } else if (type == "사진 파일"){
            return (
                <div>
                    <button className="close_icon_postview" onClick={closeModal}/>
                    <h1>편집 정보</h1>
                    <label>편집 여부: 편집이 의심됩니다.</label><br/>
                    <label>편집 의심 이유: 이유 + 프로그램명</label><br/>

                    <h1>조작 여부 탐지</h1>
                    <label>조작 여부: 조작이 의심 됩니다.</label><br/>
                    <label>조작 의심 이유: 카카오톡 조작 어플 사용이 의심됩니다.</label><br/>
                    
                </div>
            )
        }
    }

    return (
      <>
        <ModalOverlay visible={visible} />
        <ModalWrapper className={className} tabIndex="-1" visible={visible}>
          <ModalInner tabIndex="0" className="modal-inner">
            {children}
            {modal_contents(type)}
          </ModalInner>
        </ModalWrapper>
      </>
    )
  }
  
  ChangedModal.propTypes = {
    visible: PropTypes.bool,
    type: PropTypes.string,
    closeModal: PropTypes.func,
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
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
    background-color: #fff;
    border-radius: 20px;
    width: 820px;
    height: 620px;
    top: 50%;
    transform: translateY(-50%);
    margin: 0 auto;
    padding: 40px 20px;
  `

export default ChangedModal;