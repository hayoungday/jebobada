import React, {useEffect, useState} from 'react';
import { Link, RouteComponentProps } from "react-router-dom";

import './reportHeader.css'
import ViewArtifact from './ViewArtifact'
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@mui/material/Dialog';
import EvidenceDetailsEdit from './EvidenceDetailsEdit';
import axios from 'axios';
import EvidenceDetailsArtifact from './EvidenceDetailsArtifact';


const EvidenceDetailsPostView = (props) => {
  const [binary,setBianry]=useState("")
    let checkedTrue=[]
    const getBinary=()=>{
      let body={
        url : "https://craftguy.s3.ap-northeast-2.amazonaws.com/"+ props.filehash,
        key:localStorage.getItem("key")      
      }
      axios.post("/load_s3_image",body).then((res)=>{
        setBianry(res.data.res)
      })
    }
    useEffect(()=>{
      getBinary();
      
    },[])

    const [open, setOpen] = useState(false)
    
    const [filename, setFilename] = useState("")

    const [meta, setMeta] = useState({})

    const [filetype, setFiletype] = useState("")
    const [filesize, setFilesize] = useState("")
    const [imageCtime, setImageCtime] = useState("")
    const [gpsPosition, setgpsPosition] = useState("")
    const [deviceModel, setDeviceModel] = useState("")
    const [software, setSoftware] = useState("")
    const [audioCtime, setAudioCtime] = useState("")
    const [title, setTitle] = useState("")
    const [duration, setDuration] = useState("")

    const [date, setDate] = useState("")
    const [location,setLocation] = useState("")
    const [attacker, setAttacker] = useState("")
    const [desc, setDesc] =useState("")

    const url = "https://craftguy.s3.ap-northeast-2.amazonaws.com/"+ props.filehash

    const handleClickOpen = () => {
      setOpen(true)
    }

    const handleClose = () => {
      setOpen(false);
    };

    const handleSubmit = () => {
      setOpen(false);
    }

    const metaset = () => {
      setFiletype(meta.fileType)
    }

    useEffect(()=>{
      setFilename(props.filename)

      // setFiletype(props.filetype)
      // setFilesize(props.filesize)
      // setImageCtime(props.imageCtime)
      // setgpsPosition(props.gpsPosition)
      // setDeviceModel(props.deviceModel)
      // setSoftware(props.software)

      // setAudioCtime(props.audioCtime)
      // setTitle(props.title)
      // setDuration(props.duration)
      // var meta2 = Object.keys(props.meta).map((key)=>props.meta[key])
      setMeta(props.meta)
      setDate(props.date)
      setLocation(props.location)
      setAttacker(props.attacker.join(", "))
      setDesc(props.desc)
    },[])
    const pic_data = () => {
      return(
        <>
            {console.log(meta)}
            {console.log(typeof meta)}
            {console.log(typeof meta.fileType)}
            
            {console.log(meta.fileType)}

            <label>파일 이름 : {filename}</label><br/>
            <label>파일 형식 : {meta.filetype}</label><br/>
            <label>파일 크기 : {meta.fileSize}</label><br/>
            <label>촬영 시각 : {meta.imageCtime}</label><br/>
            <label>촬영 장소 : {meta.gpsPosition}</label><br/>
            <label>촬영 기기 : {meta.deviceModel}</label><br/>
            <label>촬영 기기 소프트웨어 버전 : {meta.software}</label><br/>
            <br/>
            <label>일시: {date}</label><br/>
            <label>발생 장소: {location}</label><br/>
            <label>행위자: {attacker}</label><br/>
            <label>상세 설명: {desc}</label><br/><br/><br/>
        </>
      )
    }


    if (props.filetype === "사진 파일"){
      return(
        <div>
          <h1>증거자료{props.idx+1} | {filename} </h1>
          {binary===""?(<CircularProgress variant="indeterminate" value="변환중" />):<img class='image_contents_design' src={`data:image/png;base64,${binary}`} />}
          <br/>
          {pic_data()}
          <button onClick={handleClickOpen}>수정</button>
          <Dialog open={open} onClose={handleClose}>
            <EvidenceDetailsEdit 
              handleClose={handleClose}
              handleSubmit={handleSubmit}
              filename={filename}
              setFilename = {setFilename}
              filetype={filetype}
              setFiletype = {setFiletype}
              filesize={filesize}
              setFilesize = {setFilesize}
              imageCtime={imageCtime}
              setImageCtime = {setImageCtime}
              gpsPosition={gpsPosition}
              setgpsPosition = {setgpsPosition}
              deviceModel={deviceModel}
              setDeviceModel = {setDeviceModel}
              software={software}
              setSoftware = {setSoftware}
              date={date}
              setDate = {setDate}
              location={location}
              setLocation = {setLocation}
              attacker={attacker}
              setAttacker = {setAttacker}
              desc={desc}
              setDesc = {setDesc}
            />
          </Dialog>
        </div>
      )
    } else if (props.filetype === "녹음 파일"){
      const src="data:audio/ogg;base64,"+binary
      return(
        <div>
          <h1>증거자료{props.idx+1} | {props.filename} </h1>
          <div class='image_contents_design'>
          {binary===""?(<CircularProgress variant="indeterminate" value="변환중"/>):<audio controls src={src}/>}
          </div>
          <br/>
          <label>파일 이름 : {filename}</label><br/>
          <label>파일 형식 : {meta.filetype}</label><br/>
          <label>파일 크기 : {meta.filesize}</label><br/>
          <label>녹음 시각 : {meta.audioCtime}</label><br/>
          <label>녹음 장소 : {meta.title}</label><br/>
          <label>녹음 길이 : {meta.duration}</label><br/>
          
          <br/>
          <label>일시: {date}</label><br/>
          <label>발생 장소: {location}</label><br/>
          <label>행위자: {attacker}</label><br/>
          <label>상세 설명: {desc}</label><br/><br/><br/>
        </div>
      )
    } else{
      return(
        <div>
          {console.log(props.data)}

          <h1>증거자료{props.idx+1} | {props.filename} </h1>
          <br/>
          
          
          <br/>
          <EvidenceDetailsArtifact attacker={props.attacker} desc={props.desc} object_id={props._id} artifactAnalysis={props.data.artifactAnalysis} date={props.data.date} type={props.data.type}/>
          <br/>
          <br/>
          <ViewArtifact data={props.data} object_id={props._id}/>

          {/* <label>행위자: {props.attacker.join(",")}</label><br/>
          <label>상세 설명: {props.desc}</label><br/><br/><br/>
          <br/>
          <h3>컴퓨터 사용 기록 해석</h3>
          <br></br>
          {props.data.artifactAnalysis} */}
          <br></br>       
          
          
          
        </div>
      )
    }
  

    
}

export default EvidenceDetailsPostView;