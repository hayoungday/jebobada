import React, { Component } from 'react';
import PropTypes from 'prop-types'
import styled from 'styled-components'
 
function ChangedModal({ className, visible, children, relatedMetadata, programNames, reason, manipulated,edited, type, closeModal }) {

    const pic_edited = () => {
      if (edited == "true"){
        return ("편집이 의심됩니다.")
      } else if (edited=="false"){
        return ("편집 흔적을 찾을 수 없습니다")
      } else if (manipulated == "true"){
          return ("조작된 카카오톡 대화창입니다.")
      } else{
        return ("에러를 찾아라~")
      }
    }

    const pic_cause = () => {
      if (reason == "notLinedUp"){
        return("카카오톡 대화창이 바르게 정렬되지 않았습니다.")
      } else if (reason == "fakeApp"){
        return("카카오톡 조작어플(톡썰메이커)가 사용된 흔적을 발견했습니다.")
      } else if (reason == "none"){
        return("편집 프로그램을 사용하거나 이미지를 조작한 흔적을 찾을 수 없습니다")
      } else if (reason == "useprogram"){
        return("다음 프로그램 사용 흔적 발견 - ",{programNames})
      }
      
    }

    const aud_edited = () =>{
      if (edited == "true"){
        console.log(edited)
        return("편집이 의심됩니다.")
      } else if ( edited == "false"){
        console.log(edited)
        return("편집 흔적을 찾을 수 없습니다.")
      } else{
        console.log("error",edited)
      }
    }

    const aud_cause = () =>{
      if (edited == "true"){
        console.log(edited)
        if (reason =="meta"){
          console.log(reason)
          return({programNames},"프로그램을 사용하여 편집한 흔적이 발견되었습니다.")
        }
        else if (reason =="cmt"){
          console.log(reason)
          return("음성파일이 수정된 시간이 생성시간보다 최근입니다.")
        }
      } else if ( edited == "false"){
        console.log(edited)
        return("편집 프로그램을 사용한 흔적이 발견되지 않았습니다.")
      }
    }

    const modal_contents = (type) => {
        if(type=="녹음 파일"){
            return(
                <>
                    <button className="close_icon_postview" onClick={closeModal}/>                  
                    <div className="flex-container-column-meta">
                      <span className="info_modify">편집 정보</span>
                      <span className="help_text">
                        편집 프로그램 사용 및 내용 짜깁기 등을 탐지하여 녹음 파일이 가공되었는지 확인합니다.
                      </span>

                      <div className="jb-md-meta-flex-container">
                        <span className="info_modify_text">편집 여부</span>
                        <div className="info_modify_container">
                          <span className="info_modify_cont_text">{aud_edited()}</span>
                        </div>
                      </div>
                      <div className="jb-md-meta-flex-container">
                        <span className="info_modify_text">판단 이유</span>
                        <div className="info_modify_container2">
                          <span className="info_modify_cont_text2">{aud_cause()}</span>
                        </div>
                      </div>
                    </div>      
                </>
            )
        } else if (type == "사진 파일"){
            return (
              <>
              <button className="close_icon_postview" onClick={closeModal}/>                  
              <div className="flex-container-column-meta">
                <span className="info_modify">편집 정보</span>
                <span className="help_text">
                  편집 프로그램 사용 및 내용 짜깁기 등을 탐지하여 녹음 파일이 가공되었는지 확인합니다.
                </span>

                <span className="info_modify_text">편집 여부</span>
                <div className="info_modify_container">
                  <span className="info_modify_cont_text">{pic_edited()}</span>
                  {console.log(aud_edited())}
                </div>

                <span className="info_modify_text">판단 이유</span>
                <div className="info_modify_container2">
                  <span className="info_modify_cont_text2">{pic_cause()}</span>
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
  
  ChangedModal.propTypes = {
    visible: PropTypes.bool,
    type: PropTypes.string,
    closeModal: PropTypes.func,
    edited: PropTypes.string,
    manipulated: PropTypes.string,
    relatedMetadata: PropTypes.array,
    programNames: PropTypes.string,
    reason: PropTypes.string,
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
    height: 446px;
    top: 50%;
    transform: translateY(-50%);
    margin: 0 auto;
    padding: 40px;
  `

export default ChangedModal;