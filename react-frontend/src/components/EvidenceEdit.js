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

    return(
    <div className="flex-column-container">
        {console.log(props)}
        <Header />
        <div className="flex-container-agree">
            <div className="agree-box" style={{ backgroundColor: "#dee5f8" }}>
            <span className="agree-text" style={{ color: "000" }}>
                개인정보
                <p />
                수집 및 이용 동의
            </span>
            </div>
            <img
            className="connect-square"
            src="../static/react/square_icon.png"
            />
            <div className="case-box" style={{ backgroundColor: "#dee5f8" }}>
            <span className="case-text" style={{ color: "#000" }}>
                사건 생성 및 선택
            </span>
            </div>
            <img
            className="connect-square"
            src="../static/react/square_icon.png"
            />
            <div
            className="upload-box"
            style={{ backgroundColor: "#3d7be6" }}
            >
            <span className="upload-text" style={{ color: "#fff" }}>
                증거 등록
            </span>
            </div>
        </div>
        <div>
            <form onSubmit={handleFormSubmit}>
                일시:{" "}
                <input
                    type="date"
                    name="date"
                    value={date}
                    onChange={onDateHandler}
                />
                <br />
                발생장소:{" "}
                <input
                    type="text"
                    name="location"
                    value={location}
                    onChange={onLocationHandler}
                />
                <br />
                행위자
                <br />
                (가해자):{" "}
                <input
                    type="text"
                    name="attacker"
                    value={attacker}
                    onChange={onAttackerHandler}
                />
                <br />
                괴롭힘
                <br/>
                유형:{"    "}
                {/* {items.map(({name, id},index)=>{
                    return(
                        <li key={index}>
                            <label>
                            <input type="checkbox" name={name} value={id} checked={setChecked[index]} onChange={()=>onCheckedHandler(index)}/>
                            {name}
                            </label>
                        </li>
                    )
                })} */}
                <input type = "button" onClick={() => {setIsModalOpen(true); setType("physics");}} value = "신체적"/>
                <input type = "button" onClick={() => {setIsModalOpen(true); setType("lang");}} value = "언어적"/>
                <input type = "button" onClick={() => {setIsModalOpen(true); setType("onwork");}} value = "업무적"/>
                <input type = "button" onClick={() => {setIsModalOpen(true); setType("outwork");}} value = "업무외"/>
                <input type = "button" onClick={() => {setIsModalOpen(true); setType("group");}} value = "집단적"/>
                <input type = "button" onClick={() => {setIsModalOpen(true); setType("sexual");}} value = "성희롱"/>
                <Check_Modal visible={isModalOpen} type = {type} getSetValue={getSetValue}>
                    <button onClick={(e) => {
                        e.preventDefault()
                        setIsModalOpen(false)
                    }}>닫기</button>
                </Check_Modal>
                
                <br/>
                {setaa}
                <br/>
                구체적인
                <br />
                피해사실:{" "}
                <input
                    type="text"
                    name="description"
                    value={desc}
                    onChange={onDescHandler}
                />
                <br />
                <input
                    type="file"
                    name="file"
                    file={file}
                    value={filename}
                    onChange={onFileHandler}
                />
                <input type="submit" class="btn btn-primary" value="등록"/>
            </form>
            
        </div>
    </div>
    );
}

export default EvidenceEdit