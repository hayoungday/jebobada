import React, {useEffect, useState} from 'react';
import { Link, RouteComponentProps } from "react-router-dom";
import TextField from "@mui/material/TextField";
import './reportHeader.css'
import './EvidenceDetails.css'
import ViewArtifact from './ViewArtifact'
import Button from "@mui/material/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@mui/material/Dialog';
import EvidenceDetailsEdit from './EvidenceDetailsEdit';
import axios from 'axios';
import EvidenceDetailsArtifact from './EvidenceDetailsArtifact';
import EvidenceDetailsSTT from './EvidenceDetailsSTT';
import CheckIcon from '@mui/icons-material/Check';
import Stack from "@mui/material/Stack";
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { Table } from '@mui/material';
import { makeStyles } from "@material-ui/core/styles";
import { fontFamily, style } from '@mui/material/node_modules/@mui/system';

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

    const [editMode, setEditMode] = useState(false)
    
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

    const [attacker, setAttacker] = useState([])

    const [desc, setDesc] =useState("")
    const [descTmp,setDescTmp]=useState("")

    const url = "https://craftguy.s3.ap-northeast-2.amazonaws.com/"+ props.filehash

    
    const editTrue = () => {
      setEditMode(true)
    }

    const editFalse = () => {
      setEditMode(false)
    };

    const handleSubmit = () => {
      setDesc(descTmp)
      let body={
        _id:props._id,
        desc:descTmp
      }
      axios.post("/editEvidenceDetail",body)
      setDesc(descTmp)      
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
      setDescTmp(props.desc)

    },[])
    const pic_data = () => {
      return (
        <>
          {console.log(meta)}
          {console.log(typeof meta)}
          {console.log(typeof meta.fileType)}

          {console.log(meta.fileType)}

          <Stack direction="row" justifyContent="space-around" spacing={4}>
              <Stack direction="row" justifyContent="flex-start" spacing={2}>
                <span className="yoon_evidenceDetail-info">일시</span>
                <span className="yoon_evidenceDetail-infodesc">{date}</span>
              </Stack>
              
              <Stack direction="row" justifyContent="flex-start" spacing={2}>
                <span className="yoon_evidenceDetail-info">행위자</span>
                <span className="yoon_evidenceDetail-infodesc">{attacker}</span>
              </Stack>
              <Stack direction="row" justifyContent="flex-start" spacing={2}>
                <span className="yoon_evidenceDetail-info">발생 장소</span>
                <span className="yoon_evidenceDetail-infodesc">{location}</span>
              </Stack>
              
              <Stack direction="row" justifyContent="flex-start" spacing={2}>
                <span className="yoon_evidenceDetail-info">괴롭힘 유형</span>
                <span className="yoon_evidenceDetail-infodesc">
                  {props.data.type.join(", ")}
                </span>
              </Stack>
          </Stack>
          <br />
          <br />
          <div className="yoon-flex-container-with-hy">
          {/* <Stack direction="row" justifyContent="center" spacing={4}> */}
            <div className="yoon_evidenceDetail-image">
              {binary === "" ? (
                <CircularProgress variant="indeterminate" value="변환중" />
              ) : (
                <img src={`data:image/png;base64,${binary}`} style={{height:"375px"}}/>
              )}
            </div>

            <div className="yoon-table-style-with-hy">
              <TableBody>
                <TableRow>
                  <TableCell style={{width:"150px"}}
                    className="yoon_evidenceDetail-tablecell"
                    align="center"
                  >
                    파일 이름
                  </TableCell>
                  <TableCell style={{width:"300px"}}
                    className="yoon_evidenceDetail-tablecell"
                    align="center"
                  >
                    {filename}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className="yoon_evidenceDetail-tablecell"
                    align="center"
                  >
                    파일 형식
                  </TableCell>
                  <TableCell
                    className="yoon_evidenceDetail-tablecell"
                    align="center"
                  >
                    {meta.filetype}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className="yoon_evidenceDetail-tablecell"
                    align="center"
                  >
                    파일 크기
                  </TableCell>
                  <TableCell
                    className="yoon_evidenceDetail-tablecell"
                    align="center"
                  >
                    {meta.fileSize}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className="yoon_evidenceDetail-tablecell"
                    align="center"
                  >
                    촬영 시각
                  </TableCell>
                  <TableCell
                    className="yoon_evidenceDetail-tablecell"
                    align="center"
                  >
                    {meta.imageCtime}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className="yoon_evidenceDetail-tablecell"
                    align="center"
                  >
                    촬영 장소
                  </TableCell>
                  <TableCell
                    className="yoon_evidenceDetail-tablecell"
                    align="center"
                  >
                    {meta.gpsPosition}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className="yoon_evidenceDetail-tablecell"
                    align="center"
                  >
                    촬영 기기
                  </TableCell>
                  <TableCell
                    className="yoon_evidenceDetail-tablecell"
                    align="center"
                  >
                    {meta.deviceModel}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className="yoon_evidenceDetail-tablecell"
                    align="center"
                  >
                    촬영 기기 소프트웨어 버전
                  </TableCell>
                  <TableCell
                    className="yoon_evidenceDetail-tablecell"
                    align="center"
                  >
                    {meta.software}
                  </TableCell>
                </TableRow>
              </TableBody>
            </div>
          </div>
          {/* </Stack> */}

          {/* <label>상세 설명: {desc}</label><br/><br/><br/> */}
          <br />
          <Stack direction="row" spacing={2} alignItems="center">
          <span className="yoon_evidenceDetail-desc">상세 설명</span>
          <div>
            {editMode === false ? (
              <div>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditMode(true);
                  }}
                >
                  수정하기
                </Button>
              </div>
            ) : (
              <div>
                <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    editFalse();
                    alert("수정을 취소하였습니다");
                  }}
                >
                  취소
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setEditMode(false);
                    handleSubmit();
                    alert("수정되었습니다");
                  }}
                >
                  확인
                </Button>
                </Stack>
              </div>
            )}
          </div>
          </Stack>
          <div>
            {editMode === false ? (
              <div className="yoon_evidenceDetail-desc-textbox">
                {desc}
              </div>
            ) : (
              <div className="yoon_evidenceDetail-desc-edittextbox">
                <TextField
                  fullWidth
                  defaultValue={desc}
                  multiline
                  onChange={(e) => setDescTmp(e.target.value)}
                  InputProps={{style:{fontFamily:"NotoSansKR-Light",fontSize:"21px",padding:"2%"}}}
                />
              </div>
            )}
          </div>
          <br />
          
          <br />
          <br />
        </>
      );
    }
    const aud_data = () => {
      return (
        <>
        <Stack direction="row" justifyContent="space-around" spacing={4}>
              <Stack direction="row" justifyContent="flex-start" spacing={2}>
                <span className="yoon_evidenceDetail-info">일시</span>
                <span className="yoon_evidenceDetail-infodesc">{date}</span>
              </Stack>
              
              <Stack direction="row" justifyContent="flex-start" spacing={2}>
                <span className="yoon_evidenceDetail-info">행위자</span>
                <span className="yoon_evidenceDetail-infodesc">{attacker}</span>
              </Stack>
              <Stack direction="row" justifyContent="flex-start" spacing={2}>
                <span className="yoon_evidenceDetail-info">발생 장소</span>
                <span className="yoon_evidenceDetail-infodesc">{location}</span>
              </Stack>
              
              <Stack direction="row" justifyContent="flex-start" spacing={2}>
                <span className="yoon_evidenceDetail-info">괴롭힘 유형</span>
                <span className="yoon_evidenceDetail-infodesc">
                  {props.data.type.join(", ")}
                </span>
              </Stack>
          </Stack>
          <br/>
          <EvidenceDetailsSTT props={props}/>
        
          {/* <label>파일 이름 : {filename}</label>
          <br />
          <label>파일 형식 : {meta.filetype}</label>
          <br />
          <label>파일 크기 : {meta.filesize}</label>
          <br />
          <label>녹음 시각 : {meta.audioCtime}</label>
          <br />
          <label>녹음 장소 : {meta.title}</label>
          <br />
          <label>녹음 길이 : {meta.duration}</label> */}
          <br />
          <Stack direction="row" spacing={2} alignItems="center">
          <span className="yoon_evidenceDetail-desc">상세 설명</span>
          <div>
            {editMode === false ? (
              <div>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditMode(true);
                  }}
                >
                  수정하기
                </Button>
              </div>
            ) : (
              <div>
                <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    editFalse();
                    alert("수정을 취소하였습니다");
                  }}
                >
                  취소
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setEditMode(false);
                    handleSubmit();
                    alert("수정되었습니다");
                  }}
                >
                  확인
                </Button>
                </Stack>
              </div>
            )}
          </div>
          </Stack>
          <div>
            {editMode === false ? (
              <div className="yoon_evidenceDetail-desc-textbox">
                {desc}
              </div>
            ) : (
              <div className="yoon_evidenceDetail-desc-edittextbox">
                <TextField
                  fullWidth
                  defaultValue={desc}
                  multiline
                  onChange={(e) => setDescTmp(e.target.value)}
                  InputProps={{style:{fontFamily:"NotoSansKR-Light",fontSize:"21px",padding:"2%"}}}
                />
              </div>
            )}
          </div>
        </>
      );
    };


    if (props.filetype === "사진 파일"){
      return(
        <div>
          <Stack direction="row" alignItems="center" spacing={3}>
          
          <span className="yoon_evidenceDetail-filename-background"> {props.idx+1}) {filename} </span>
          
          {props.data.ismain==="yes"?<span className="yoon_evidenceDetail-filename-ismain"><CheckIcon/> 핵심증거입니다.</span>:null}
          </Stack>
          <br/>
          <br/>
          {pic_data()}
          {/* <Dialog open={open} onClose={handleClose}>
            <EvidenceDetailsEdit 
              handleClose={handleClose}
              handleSubmit={handleSubmit}
              filename={filename}
              setFilename = {setFilenameTmp}
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
              setDate = {setDateTmp}
              location={location}
              setLocation = {setLocationTmp}
              attacker={attacker}
              setAttacker = {setAttackerTmp}
              desc={desc}
              setDesc = {setDescTmp}
            />
          </Dialog> */}
        </div>
      )
    } else if (props.filetype === "녹음 파일"){
      
      return(
        <div>
          <Stack direction="row" alignItems="center" spacing={3}>
          
          <span className="yoon_evidenceDetail-filename-background"> {props.idx+1}) {filename} </span>
          
          {props.data.ismain==="yes"?<span className="yoon_evidenceDetail-filename-ismain"><CheckIcon/> 핵심증거입니다.</span>:null}
          </Stack>
          
          <br/>
          <br/>
          {aud_data()}
          <br/>
          
          
        </div>
      )
    } else{
      return(
        <div>
          {console.log(props.data)}

          <span className="yoon_evidenceDetail-filename-background"> {props.idx+1}) {filename} </span>
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