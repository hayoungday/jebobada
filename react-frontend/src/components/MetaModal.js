import React, { Component } from 'react';
import PropTypes from 'prop-types'
import styled from 'styled-components'

function MetaModal({ className, visible, children, type, arr, closeModal,filename }) {

    const modal_contents = (type) => {
        if(type=="녹음 파일"){
            return(
              <>
                <button className="close_icon_postview" onClick={closeModal}/>
                <div className="flex-container-column-meta">
                    <span className="modal_meta_postview">파일 정보</span>
                    <br/>
                    <div className="jb-md-meta-flex-container">
                      <span className="modal_meta_text">파일 이름: </span>
                      <label className="modal_meta_label">
                        {filename}
                      </label>
                    </div>
                    <div className="jb-md-meta-flex-container">
                      <span className="modal_meta_text">파일 형식: </span>
                      <label className="modal_meta_label">{arr.fileType}</label>
                    </div>
                    <div className="jb-md-meta-flex-container">
                      <span className="modal_meta_text">파일 크기: </span>
                      <label className="modal_meta_label">{arr.fileSize}</label>
                    </div>
                    <div className="jb-md-meta-flex-container">
                      <span className="modal_meta_text">녹음 시각: </span>
                      <label className="modal_meta_label">{arr.audioCtime}</label>
                    </div>
                    <div className="jb-md-meta-flex-container">
                      <span className="modal_meta_text">녹음 길이: </span>
                      <label className="modal_meta_label">{arr.duration}</label>
                    </div>
                    <div className="jb-md-meta-flex-container">
                      <span className="modal_meta_text">녹음 장소: </span>
                      <label className="modal_meta_label">{arr.title}</label>
                    </div>
                    {/* <label>파일 이름: {arr.fileName}</label><br/>
                    <label>파일 형식: {arr.fileType}</label><br/>
                    <label>파일 크기: {arr.fileSize}</label><br/>
                    <label>녹음 시각: {arr.audioCtime}</label><br/>
                    <label>녹음 길이: {arr.duration}</label><br/>
                    <label>녹음 장소: {arr.title}</label><br/> */}
                </div>
                </>
            )
        } else if (type == "사진 파일"){
            return (
              <>
                <button className="close_icon_postview" onClick={closeModal}/>
                <div className="flex-container-column-meta">
                    <span className="modal_meta_postview">파일 정보</span>
                    <br/>
                    <div className="jb-md-meta-flex-container">
                      <span className="modal_meta_text">파일 이름: </span>
                      <label className="modal_meta_label">{filename}</label>
                    </div>
                    <div className="jb-md-meta-flex-container">
                      <span className="modal_meta_text">파일 형식: </span>
                      <label className="modal_meta_label">{arr.fileType}</label>
                    </div>
                    <div className="jb-md-meta-flex-container">
                      <span className="modal_meta_text">파일 크기: </span>
                      <label className="modal_meta_label">{arr.fileSize}</label>
                    </div>
                    <div className="jb-md-meta-flex-container">
                      <span className="modal_meta_text">촬영 시각: </span>
                      <label className="modal_meta_label">{arr.imageCtime}</label>
                    </div>
                    <div className="jb-md-meta-flex-container">
                      <span className="modal_meta_text">촬영 기기: </span>
                      <label className="modal_meta_label">{arr.cameraModelName}</label>
                    </div>
                    <div className="jb-md-meta-flex-container">
                      <span className="modal_meta_text">촬영 장소: </span>
                      <label className="modal_meta_label">{arr.gpsPosition}</label>
                    </div>
                </div>
              </>
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
    arr : PropTypes.object,
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
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
    background-color: #fff;
    border-radius: 8px;
    width: 490px;
    height: 523px;
    top: 50%;
    transform: translateY(-50%);
    margin: 0 auto;
    padding: 40px 40px;
  `

export default MetaModal;