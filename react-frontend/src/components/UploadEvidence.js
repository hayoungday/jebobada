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
import "@pathofdev/react-tag-input/build/index.css";
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

    const [checkedItems, setCheckedItems] = useState(new Set())
    
    const setaa = checkedItems.keys()

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

    const history = useHistory()

    const addEvidence = () => {
        try {
            var formData = new FormData()
            var myType = [...setaa]
            var myType2 = Array.from(checkedItems)

            console.log(date)

            console.log({setaa})
            console.log("mytype2",myType2)
            formData.append('file',file)
            formData.append('filename',filename)
            formData.append('user',props.location.state.user)
            formData.append('case_num',props.location.state.casenum)
            formData.append('date', date)
            formData.append('location', location)
            formData.append('attacker',attacker)
            formData.append('desc',desc)
            formData.append('type',myType2)
            let config = {
                headers: {
                    'enctype':'multipart/form-data'
                }
            }
            for (let value of formData.values()){
                console.log(value)
                console.log(setaa)

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

    return (
      <div>
        <Header />
        <div className="wrap" >
          <div className="flex-column-container-upload">
            <span className="upload_title">
              증거 자료 등록
            </span>
            <span className="upload_subtitle">
              등록할 증거의 정보를 작성해주세요. 자세히 기록할 수록 도움이 됩니다.
            </span>

              <form onSubmit={handleFormSubmit}>
              <div className="upload_box">

                <div className="upload-input-text">일시*</div>
                <input className="upload-input-box" type="date" defaultValue="" onChange={(e)=>console.log(e.target.value)}/>

                <div className="upload-input-text">발생장소*</div>
                <input className="upload-input-box" type="text" name="location" placeholder="사건이 발생한 장소를 적어주세요" value={location} onChange={onLocationHandler}/>

                <div className="upload-input-text">행위자*</div>
                <ReactTagInput tags={attacker} className="upload-input-box" placeholder="행위자를 입력하고 Enter를 누르세요" maxTags={10} editable={true} readOnly={false} removeOnBackspace={true} onChange={setAttacker}/>

                <div className="upload-input-text">괴롭힘 유형*</div>
                  <div className="flex-container-modal-button">
                  <input type="button" className="upload-modal-button" onClick={() => { setIsModalOpen(true); setType("physics");}} value="신체적"/>
                  
                  <input type="button" className="upload-modal-button" onClick={() => { setIsModalOpen(true); setType("lang");}} value="언어적"/>
                  
                  <input type="button" className="upload-modal-button" onClick={() => { setIsModalOpen(true); setType("onwork");}} value="업무적"/>
                  
                  <input type="button" className="upload-modal-button" onClick={() => { setIsModalOpen(true); setType("outwork");}} value="업무외"/>
                  
                  <input type="button" className="upload-modal-button" onClick={() => { setIsModalOpen(true); setType("group");}} value="집단적"/>
                  
                  <input type="button" className="upload-modal-button" onClick={() => { setIsModalOpen(true); setType("sexual");}} value="성희롱"/>
                  </div>
                  
                  <Check_Modal visible={isModalOpen} type={type} getSetValue={getSetValue} closeModal={closeModal}>
                    <button className="close_icon_postview" onClick={(e) => { e.preventDefault(); setIsModalOpen(false);}}/>
                  </Check_Modal>
                  <br />
                  {setaa}
                  <br />

                <div className="upload-input-text">상세설명</div>
                <textarea type="text" className="upload-input-desc-box" name="description" placeholder="구체적인 피해사실을 적어주세요" value={desc} onChange={onDescHandler}/>


                <div className="upload-input-text">첨부파일</div>
                <input type="file" name="file" file={file} value={filename} onChange={onFileHandler}/>
                </div>

                <input type="submit" class="upload-button-container" value="등록" />

              </form>
            {/* <button className="upload-button-container" type="submit" value="등록">
              등록
            </button> */}
          </div>
        </div>




        {/* <div className="flex-container-agree"></div>
        <div>
          <form onSubmit={handleFormSubmit}>
            <div>
              <Stack direction="row" spacing={3}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="h5" gutterBottom component="div">
                    일시 :
                  </Typography>
                </div>
                <div>
                  <TextField
                    type="date"
                    defaultValue=""
                    sx={{ width: 250 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(event) => console.log(event.target.value)}
                  />
                </div>
              </Stack>
            </div>
            <br />
            발생장소:{" "}
            <input type="text" name="location" placeholder="사건이 발생한 장소를 적어주세요" value={location} onChange={onLocationHandler}/>
            <br />
            행위자:{" "}
            <ReactTagInput tags={attacker} placeholder="행위자를 입력하고 Enter를 누르세요" maxTags={10} editable={true} readOnly={false} removeOnBackspace={true} onChange={setAttacker}/>
            <br />
            괴롭힘<br />유형:{"    "}
            <input type="button" onClick={() => { setIsModalOpen(true); setType("physics");}} value="신체적"/>
            
            <input type="button" onClick={() => { setIsModalOpen(true); setType("lang");}} value="언어적"/>
            
            <input type="button" onClick={() => { setIsModalOpen(true); setType("onwork");}} value="업무적"/>
            
            <input type="button" onClick={() => { setIsModalOpen(true); setType("outwork");}} value="업무외"/>
            
            <input type="button" onClick={() => { setIsModalOpen(true); setType("group");}} value="집단적"/>
            
            <input type="button" onClick={() => { setIsModalOpen(true); setType("sexual");}} value="성희롱"/>
            
            <Check_Modal visible={isModalOpen} type={type} getSetValue={getSetValue}>
              <button onClick={(e) => { e.preventDefault(); setIsModalOpen(false);}}>
                닫기
              </button>
            </Check_Modal>
            <br />
            {setaa}
            <br />
            상세설명:{" "}
            <input type="text" name="description" placeholder="구체적인 피해사실을 적어주세요" value={desc} onChange={onDescHandler}/>
            <br />
            <input
              type="file"
              name="file"
              file={file}
              value={filename}
              onChange={onFileHandler}
            />
            <input type="submit" class="btn btn-primary" value="등록" />
          </form>
          </div>
        </div> */}
      </div>
    );
}

export default UploadEvidence