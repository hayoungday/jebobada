import React, { Component, useState } from 'react';
import PropTypes from 'prop-types'
import styled from 'styled-components'
import "./Agree.css"
import axios from 'axios';

function CaseEdit_Modal({ className, visible, case_name, user, children }) {

    const [description, setDesc] = useState("");

    const modal_contents = (children) => {

        const onDescHandler = (event) => {
            setDesc(event.currentTarget.value)
        }

        const addCase = (e) => {
            let body = {
                case_name : {case_name},
                description : description,
                user : {user},
            }

            return axios.post("/caseupdate", body);
        }


        const handleFormSubmit =(e)=>{
            e.preventDefault()
            try{
                addCase(e)
            }
            catch(err){
                return console.lor(err)
            }
        }

        return(
            <form onSubmit={handleFormSubmit}>
                <div className="flex-container-first-box">
                    <span className="case_name">
                        사건명: {case_name}
                    </span>
                </div>

                <div className="flex-container-first-box">
                <span className="case_description"> 한줄요약:{" "}</span>
                <input className="case_description_input"
                    type="text"
                    name="description"
                    placeholder="한줄요약"
                    value={description}
                    onChange={onDescHandler}
                />
                </div> 

                {/* onClick={() => {
                    this.setState({
                    isModalOpen: false,
                    cases: undefined,
                    });
                }} */}

                <button className="case_button">
                <span className="case_button_text">수정</span>
                </button>
            </form>     
        )

    }
    return (
      <>
        <ModalOverlay visible={visible} />
        <ModalWrapper className={className} tabIndex="-1" visible={visible}>
          <ModalInner tabIndex="0" className="modal-inner">
            {children}
            {modal_contents(children)}
          </ModalInner>
        </ModalWrapper>
      </>
    )
  }
  
  CaseEdit_Modal.propTypes = {
    visible: PropTypes.bool,
    case_name : PropTypes.string,
    user: PropTypes.string
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

export default CaseEdit_Modal;