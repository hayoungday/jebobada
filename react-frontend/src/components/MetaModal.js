import React, { Component } from 'react';
import PropTypes from 'prop-types'
import styled from 'styled-components'

function MetaModal({ className, visible, children, type, arr }) {

    const modal_contents = (type) => {
        if(type=="녹음 파일"){
            return(
                <div>
                    <h1>파일 정보</h1>
                    <label>파일 이름: {arr.fileName}</label><br/>
                    <label>파일 형식: {arr.fileType}</label><br/>
                    <label>파일 크기: {arr.fileSize}</label><br/>
                    <label>녹음 시각: {arr.audioCtime}</label><br/>
                    <label>녹음 길이: {arr.duration}</label><br/>
                    <label>녹음 장소: {arr.title}</label><br/>
                </div>
            )
        } else if (type == "사진 파일"){
            return (
                <div>
                    <h1>파일 정보</h1>
                    <label>파일 이름: {arr.fileName}</label><br/>
                    <label>파일 형식: {arr.fileType}</label><br/>
                    <label>파일 크기: {arr.fielSize}</label>
                    <label>촬영 시각: {arr.imageCtime}</label><br/>
                    <label>촬영 기기: {arr.cameraModelName}</label><br/>
                    <label>촬영 장소: {arr.gpsPosition}</label><br/>
                    
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
  
  MetaModal.propTypes = {
    visible: PropTypes.bool,
    type : PropTypes.string,
    arr : PropTypes.object
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
    background-color: #dee5f8;
    border-radius: 50px;
    width: 600px;
    max-width: 800px;
    height: 400px;
    top: 50%;
    transform: translateY(-50%);
    margin: 0 auto;
    padding: 40px 20px;
  `

export default MetaModal;