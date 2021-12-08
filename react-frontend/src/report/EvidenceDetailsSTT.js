import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from '@mui/material/Stack';

import { Checkbox, Tab, TableRow } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  height: 900,
  overflowY: "scroll",
  borderRadius: "10px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 5,
};

const EvidenceDetailsSTT = (props) => {
  const [choosedOnReport,setChoosedOnReport]=useState(props.props.data.choosedOnReport)
  const [editMode, setEditMode] = useState(false);
  const [segmentsRes,setSegmentsRes]=useState([])
  const [segments, setSegments] = useState(props.props.data.segments);
  const [allCheck,setAllCheck]=useState(false);

  const handleOpen = () => setEditMode(true);
  const handleClose = () => setEditMode(false);
  const handleSegments = (segments) => {
    setSegments(segments);
  };
  const [tmp, setTmp] = useState({});
  console.log(tmp);

  const initialTmp=()=>{
    let i=0;
    for(i=0;i<segments.length;i++){
      tmp[i]=segments[i].isChecked
    }
  }

  const tmpHandler = (e) => {
    setTmp({ ...tmp, [`${e.target.id}`]: e.currentTarget.checked });
  };


  const checkHandler = (checked, id) => {
    if (checked) {
      console.log(id, checked);
      segments[id].isChecked = true;
      console.log(segments);
      // handleSegments(segments);
    } else {
      console.log(id, checked);
      segments[id].isChecked = false;
      console.log(segments);
      // handleSegments(segments);
    }
  };

  const sttHandler=(text,id)=>{
    segments[id].stt=text;
    console.log(segments)
  }

  const submitHandler=()=>{
    let body={
      _id:props.props._id.$oid,
      segments:segments
    }
    axios.post("/editSTTReport",body)
    setSegmentsRes(segments)
    setChoosedOnReport(true)
    handleClose()
  }

  const viewCheckedSentences = () => {
    return editMode==false?(
      <div>
        {segmentsRes.map((c, i) => {
          return c.isChecked == true ? (
            <div>
              {c.speaker}
              <br />
              {c.stt}
            </div>
          ) : null;
        })}
      </div>
    ):null;    
  };
  console.log(props);

  useEffect(()=>{
    initialTmp()
    setSegmentsRes(props.props.data.segments)
  },[])
  // console.log(props.props._id.$oid)
  return (
    <div>
      <div
        style={{
          border: "1px solid",
          display: "flex",
          justifyContent: "center",
          height: "400px",
          alignItems: "center",
        }}
      >
        {choosedOnReport == false ? (
          <Button onClick={handleOpen} variant="outlined">
            선택하기
          </Button>
        ) : (
          <div>
            {viewCheckedSentences()}
            <br/>
            <Button onClick={handleOpen} variant="outlined">
              선택하기
            </Button>
          </div>
        )}
      </div>

      <Modal open={editMode} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6">선택하기</Typography>
          <Typography sx={{ mt: 2 }}>
            증거로 활용할 문장을 선택해주세요
          </Typography>
          <br />

          {/* <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => {
                  checkAllHandler(e)
                }}
                defaultChecked={allCheck==true?true:false}
              />
            }
            label="전체ㅋ 선택"
          /> */}
          <br />

          {segments.map((c, i) => {
            return (
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      id={i}
                      onChange={(e) => {
                        checkHandler(e.currentTarget.checked, i);
                        tmpHandler(e);
                      }}
                      defaultChecked={c.isChecked == false ? false : true}
                    />
                  }
                  label={
                    <TextField
                      style={{ width: "750px" }}
                      variant="outlined"
                      disabled={!tmp[i]}
                      defaultValue={c.stt}
                      onChange={(e) => sttHandler(e.target.value, i)}
                      fullWidth
                      multiline
                    />
                  }
                />
                <br />
                <br />
              </div>
            );
          })}
          <Stack
            style={{ justifyContent: "center" }}
            direction="row"
            spacing={3}
          >
            <Button variant="outlined" onClick={() => handleClose()}>
              취소
            </Button>
            <Button variant="contained" onClick={() => submitHandler()}>
              확인
            </Button>
            
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};

export default EvidenceDetailsSTT;
