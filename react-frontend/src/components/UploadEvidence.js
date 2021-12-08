import React, { Component, useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types'
import axios from 'axios'
import Header from "./Header";
import "./Agree.css";
import Checkbox from "./Checkbox";
import Check_Modal from "./Check_Modal";
import { Button } from "@material-ui/core";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/src/styles/index.css";
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import './Upload.css'
 
const UploadEvidence = (props) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [type, setType] = useState("");

    const [user, setUser] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [attacker, setAttacker] = useState([]);
    const [desc, setDesc] = useState("");
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState("");
    const [mainevdi, setMainEvdi] = useState("yes");

    const [checkedItems, setCheckedItems] = useState(new Set())
    
    const myType3 = Array.from(checkedItems)

    const getSetValue = (set) => {
        console.log("실행됨")
        setCheckedItems(set)
        console.log(checkedItems)
        
    }
    
    useEffect(() => {
      }, [isModalOpen, checkedItems]);

    const onDateHandler = (event) => {
        setDate(event.currentTarget.value);
    };

    const onLocationHandler = (event) => {
        setLocation(event.currentTarget.value);
    };

    const onAttackerHandler = (event) => {
        setAttacker(event.currentTarget.value)
    }

    const onDescHandler = (event) => {
        setDesc(event.currentTarget.value)
    }

    const onFileHandler = (event) => {
        setFile(event.currentTarget.files[0])
        setFilename(event.currentTarget.value)
    }

    const onMainHandler = (event) => {
      setMainEvdi(event.currentTarget.value)
    }

    const history = useHistory()

    const addEvidence = () => {
        try {
            var formData = new FormData()
            var myType2 = Array.from(checkedItems)

            formData.append('file',file)
            formData.append('filename',filename)
            formData.append('user',props.location.state.user)
            formData.append('case_num',props.location.state.casenum)
            formData.append('date', date)
            formData.append('location', location)
            formData.append('attacker',attacker)
            formData.append('desc',desc)
            formData.append('type',myType2)
            formData.append('mainevdi',mainevdi)
            formData.append('key',localStorage.getItem('key'))

            let config = {
                headers: {
                    'enctype':'multipart/form-data'
                }
            }

            axios.post("/upload",formData,config).then((res)=>{
                if(res.data.result==="file_upload_block"){
                    alert("동일한 파일이 존재합니다!")
                }
                res.data.result=""
            }).catch(err=>{
                console.log(err)
            })
        } catch (err){
            return console.log(err)
        }
        
    }

    const handleFormSubmit=async(e)=>{
        e.preventDefault()
        addEvidence() 
        history.goBack()
    }

    const closeModal = (e) => {
      e.preventDefault()
      setIsModalOpen(false)
  }

  const handleFormCancel = async(e) => {
    e.preventDefault()
    history.goBack()
  }

    return (
      <div>
        <Header />
        <div className="wrap" >

        <div className="jb_banner_uploadevidence">
          <div className="jb-case-flex-container">
            <div className="jb-upload-flex-column-container">
              <span className="jb_case_banner_title">
                증거 자료 등록
              </span>
              <span className="jb_case_banner_subtitle">
              등록할 증거의 정보를 작성해주세요. 자세히 기록할수록 도움이 됩니다.<br/>
              </span>
            </div>
          </div>
        </div>

          <div className="jb-upload-box-flex-column-container">
            <form onSubmit={handleFormSubmit}>
              <div className="upload_box">
                <div className="jb-upload-evidence-flex-container">
                  <div className="jb-upload-evidence-flex-column-container">
                    <div className="upload-input-text">일시*</div>
                    <input className="upload-input-box" type="date" defaultValue="" onChange={onDateHandler}/>
                  </div>

                  <div className="jb-upload-evidence-flex-column-container">
                    <div className="upload-input-text">발생장소*</div>
                    <input className="upload-input-box" type="text" name="location" placeholder="사건이 발생한 장소를 적어주세요" value={location} onChange={onLocationHandler}/>
                  </div>
                </div>

                <div className="jb-upload-evidence-flex-container">
                  <div className="jb-upload-evidence-flex-column-container">
                    <div className="upload-input-text">행위자*</div>
                    <ReactTagInput tags={attacker} className="upload-input-box" placeholder="행위자를 입력하고 Enter를 누르세요" maxTags={10} editable={true} readOnly={false} removeOnBackspace={true} onChange={setAttacker}/>
                  </div>

                  <div className="jb-upload-evidence-flex-column-container">
                    <div className="upload-input-text">괴롭힘 유형* ({myType3.join("/")})</div>
                    <div className="flex-container-modal-button">
                      <input type="button" className="upload-modal-button" onClick={() => { setIsModalOpen(true); setType("physics");}} value="신체적"/>
                      
                      <input type="button" className="upload-modal-button" onClick={() => { setIsModalOpen(true); setType("lang");}} value="언어적"/>
                      
                      <input type="button" className="upload-modal-button" onClick={() => { setIsModalOpen(true); setType("onwork");}} value="업무적"/>
                      
                      <input type="button" className="upload-modal-button" onClick={() => { setIsModalOpen(true); setType("outwork");}} value="업무외"/>
                      
                      <input type="button" className="upload-modal-button" onClick={() => { setIsModalOpen(true); setType("group");}} value="집단적"/>
                      
                      <input type="button" className="upload-modal-button" onClick={() => { setIsModalOpen(true); setType("sexual");}} value="성희롱"/>
                    </div>

                  </div>
                </div>

                <div className="jb-upload-evidence-flex-container">
                  <div className="jb-upload-evidence-flex-column-container">
                    <div className="upload-input-text">상세설명</div>
                    <textarea type="text" className="upload-input-desc-box" name="description" placeholder="구체적인 피해사실을 적어주세요" value={desc} onChange={onDescHandler}/>
                  <div>
                </div>
              </div>
              </div>                

                <div className="jb-upload-evidence-flex-container">
                  <div className="jb-upload-evidence-flex-column-container">
                    <div className="upload-input-text">첨부파일</div>
                    <input className="upload-file" type="file" name="file" file={file} value={filename} onChange={onFileHandler}/>
                  </div>

                  <div className="jb-upload-evidence-flex-column-container">
                    <div className="upload-input-text">핵심 증거 여부</div>
                      <div className="jb-upload-evidence-flex-container">
                        <input className="upload-ismain" id="yes" value="yes" name="yes" type="radio" checked={mainevdi === "yes"} onChange={onMainHandler}/>예

                        <input  className="upload-ismain" id="no" value="no" name="no" type="radio" checked={mainevdi === "no"} onChange={onMainHandler}/>아니요
                      </div>
                  </div>
                </div>
              </div>
              <div className="jb-upload-evidence-button-flex-container">
                <button class="upload-cancel-button-container" onChange={handleFormCancel}>취소</button>
                <input type="submit" class="upload-button-container" value="등록" />
              </div>
            </form>
          </div>
        </div>
        <Check_Modal visible={isModalOpen} type={type} getSetValue={getSetValue} closeModal={closeModal}>
          <button className="close_icon_postview" onClick={(e) => { e.preventDefault(); setIsModalOpen(false);}}/>
        </Check_Modal>
      </div>
    );
}

export default UploadEvidence