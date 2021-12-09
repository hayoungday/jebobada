import React, {useEffect, useState} from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
// import CustomerDelete from './CustomerDelete';
import Stack from "@mui/material/Stack"
const MainBullyingDetail =(props)=>{
    const [editMode, setEditMode] = useState(false)
    const [desc, setDesc] =useState("")
    const [descTmp,setDescTmp]=useState("")

    const editFalse = () => {
        setEditMode(false)
      };
    
    const handleSubmit = () => {
    setDesc(descTmp)
    let body={
        _id:props.data._id,
        desc:descTmp
    }
    axios.post("/editEvidenceDetail",body)
    setDesc(descTmp)      
    }

    useEffect(()=>{
        setDesc(props.data.desc)
      setDescTmp(props.data.desc)
    },[])

    return (
        <div>
        <span className="mainbullying_contents">
            {props.idx+1}) 
            <span className="highlight">{props.date}</span>에 <span className="highlight">{props.attacker.join(", ")}</span>에게 
            <span className="highlight">{props.location}</span>에서 
            <span className="highlight">{props.bullying.join(", ")}</span>을 당했습니다.<p/>
            <br/>
            </span>
            {/* <div className="mainbullying_desc">
                {props.desc}
            </div>             */}
            <Stack direction="row" spacing={2} alignItems="center">
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
          <br/>
            
        
        </div>
        
        
    )
}

export default MainBullyingDetail;