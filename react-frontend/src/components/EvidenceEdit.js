import React, { Component, useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types'
import axios from 'axios'
import Header from "./Header";
import "./Agree.css";
import Checkbox from "./Checkbox";
import Check_Modal from "./Check_Modal";
import { Button } from "@material-ui/core";
import Evidence from "./Evidence";
import ReactTagInput from "@pathofdev/react-tag-input";

 
const EvidenceEdit = (props) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [type, setType] = useState("");

    const [user, setUser] = useState("");
    const [date, setDate] = useState(props.location.state.datetime);
    const [location, setLocation] = useState(props.location.state.location);
    const [attacker, setAttacker] = useState(props.location.state.attacker);
    const [desc, setDesc] = useState(props.location.state.desc);
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState("");



    const [checkedItems, setCheckedItems] = useState(new Set(props.location.state.bullying))
    
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
            console.log({setaa})
            console.log("mytype2",myType2)
            console.log(date)

            formData.append('file',file)
            formData.append('filename',filename)
            formData.append('user',props.location.state.user)
            formData.append('case_num',props.location.state.casenum)
            formData.append('date', date)
            formData.append('location', location)
            formData.append('attacker',attacker)
            formData.append('desc',desc)
            formData.append('type',myType2)
            formData.append('index',props.location.state.index)
            let config = {
                headers: {
                    'enctype':'multipart/form-data'
                }
            }
            for (let value of formData.values()){
                console.log(value)
                console.log(setaa)

            }
            axios.post("/evidenceupdate",formData,config).then((res)=>{
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

    return(
    //     <div>
    //     <Header />
    //     <div className="wrap" >
    //       <div className="flex-column-container-upload">
    //         <span className="upload_title">
    //           증거 자료 등록
    //         </span>
    //         <span className="upload_subtitle">
    //           등록할 증거의 정보를 작성해주세요. 자세히 기록할 수록 도움이 됩니다.
    //         </span>

    //           <form onSubmit={handleFormSubmit}>
    //           <div className="upload_box">

    //             <div className="upload-input-text">일시*</div>
    //             <input className="upload-input-box" type="date" defaultValue={date} onChange={onDateHandler}/>

    //             <div className="upload-input-text">발생장소*</div>
    //             <input className="upload-input-box" type="text" name="location" placeholder="사건이 발생한 장소를 적어주세요" value={location} onChange={onLocationHandler}/>

    //             <div className="upload-input-text">행위자*</div>
    //             <ReactTagInput tags={attacker} className="upload-input-box" placeholder="행위자를 입력하고 Enter를 누르세요" maxTags={10} editable={true} readOnly={false} removeOnBackspace={true} value={attacker} onChange={setAttacker}/>

    //             <div className="upload-input-text">괴롭힘 유형*</div>
    //               <div className="flex-container-modal-button">
    //               <input type="button" className="upload-modal-button" onClick={() => { setIsModalOpen(true); setType("physics");}} value="신체적"/>
                  
    //               <input type="button" className="upload-modal-button" onClick={() => { setIsModalOpen(true); setType("lang");}} value="언어적"/>
                  
    //               <input type="button" className="upload-modal-button" onClick={() => { setIsModalOpen(true); setType("onwork");}} value="업무적"/>
                  
    //               <input type="button" className="upload-modal-button" onClick={() => { setIsModalOpen(true); setType("outwork");}} value="업무외"/>
                  
    //               <input type="button" className="upload-modal-button" onClick={() => { setIsModalOpen(true); setType("group");}} value="집단적"/>
                  
    //               <input type="button" className="upload-modal-button" onClick={() => { setIsModalOpen(true); setType("sexual");}} value="성희롱"/>
    //               </div>
                  
                  
    //               <br />
    //               {setaa}
    //               <br />

    //             <div className="upload-input-text">상세설명</div>
    //             <textarea type="text" className="upload-input-desc-box" name="description" placeholder="구체적인 피해사실을 적어주세요" value={desc} onChange={onDescHandler}/>


    //             <div className="upload-input-text">첨부파일</div>
    //             <input type="file" name="file" file={file} value={filename} onChange={onFileHandler}/>
    //             </div>

    //             <input type="submit" class="upload-button-container" value="등록" />

    //           </form>

    //       </div>
    //     </div>
    //     <Check_Modal visible={isModalOpen} type={type} getSetValue={getSetValue} closeModal={closeModal}>
    //       <button className="close_icon_postview" onClick={(e) => { e.preventDefault(); setIsModalOpen(false);}}/>
    //     </Check_Modal>
    //   </div>
    <div>
        {console.log(props)}
        <Header />
        <div className="wrap">
        <div className="flex-column-container-upload">

            <span className="upload_title"> 증거 자료 등록 </span>
             <span className="upload_subtitle">
               등록할 증거의 정보를 작성해주세요. 자세히 기록할 수록 도움이 됩니다.
             </span>
    
            <form onSubmit={handleFormSubmit}>
                <div className="upload_box">
                    <div className="upload-input-text">일시*</div>
                    <input className="upload-input-box" type="date" defaultValue={date} name="date" value={date} onChange={onDateHandler}/>
                
                    <div className="upload-input-text">발생장소*</div>
                    <input className="upload-input-box" type="text" name="location" value={location} onChange={onLocationHandler} />

                    <div className="upload-input-text">행위자*</div>
                    <ReactTagInput tags={attacker} className="upload-input-box" placeholder="행위자를 입력하고 Enter를 누르세요" maxTags={10} editable={true} readOnly={false} removeOnBackspace={true} onChange={onAttackerHandler}/>
                   
                    <div className="upload-input-text">괴롭힘 유형*</div>
                    <div className="flex-container-modal-button">
                        <input type = "button" onClick={() => {setIsModalOpen(true); setType("physics");}} value = "신체적"/>
                        <input type = "button" onClick={() => {setIsModalOpen(true); setType("lang");}} value = "언어적"/>
                        <input type = "button" onClick={() => {setIsModalOpen(true); setType("onwork");}} value = "업무적"/>
                        <input type = "button" onClick={() => {setIsModalOpen(true); setType("outwork");}} value = "업무외"/>
                        <input type = "button" onClick={() => {setIsModalOpen(true); setType("group");}} value = "집단적"/>
                        <input type = "button" onClick={() => {setIsModalOpen(true); setType("sexual");}} value = "성희롱"/>
                    </div>
                    {setaa}
                    <br/>

                    <div className="upload-input-text"> 상세설명</div>
                    <textarea type="text" className="upload-input-desc-box" name="description" placeholder="구체적인 피해사실을 적어주세요" value={desc} onChange={onDescHandler}/>

                    <div className="upload-input-text">첨부파일</div>
                    <input type="file" name="file" file={file} value={filename} onChange={onFileHandler}/>

                </div>
                
                <input type="submit" class="upload-button-container" value="등록"/>
            </form>
        </div></div>
        <Check_Modal visible={isModalOpen} type = {type} getSetValue={getSetValue}>
                    <button onClick={(e) => {
                        e.preventDefault()
                        setIsModalOpen(false)
                    }}>닫기</button>
                </Check_Modal>
    </div>                

    );
}

export default EvidenceEdit;