import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Popover from "@mui/material/Popover";

const EvidenceDetailsArtifact = (props) => {
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState(props.desc);
  const [artifactAnalysis, setArtifactAnalysis] = useState(
    props.artifactAnalysis
  );

  const [descTmp, setDescTmp] = useState(props.desc);
  const [artifactAnalysisTmp, setArtifactAnalysisTmp] = useState(
    props.artifactAnalysis
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const setting = () => {
    setDesc(descTmp);
    setArtifactAnalysis(artifactAnalysisTmp);
  };

  const handleSubmit = () => {
    let body = {
      _id: props.object_id,
      artifactAnalysis: artifactAnalysisTmp,
      desc: descTmp,
    };
    axios.post("/EditArtifactReport", body);
    setting();
    setOpen(false);
  };

  return (
    <div>
      <Stack direction="row" marginLeft="5%" marginRight="5%" spacing={8}>
        <div>일시 {props.date}</div>
        <div>행위자 {props.attacker.join(",")}</div>
        <div>괴롭힘 유형 {props.type}</div>
      </Stack>
      <br />
      <br />
      <Stack
        spacing={1}
        justifyContent="center"
        marginLeft="5%"
        marginRight="5%"
        maxwidth="70%"
      >
        <br />
        상세 설명
        <div
          style={{
            border: "3px solid #E7E6E6",
            wordBreak: "break-all",
            display: "inline-block",
            padding: "2%",
          }}
        >
          {desc}
        </div>
      </Stack>
      <Button variant="outlined" onClick={handleClickOpen}>
        예시
      </Button>
      <div>
      <Popover
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div style={{ display: "inline-block", padding: "2%" }}>
          <span style={{ color: "gray" }}>(예)</span>
          <br />
          장준형 대리에게 야근(주말) 출근을 강요당했습니다. 저의 정규 근무시간은
          09:00 ~ 18:00이지만, 19:26:51까지 초과근무를 하였습니다. 초과근무
          당시, SnippingTool.exe, 프로그램을 사용했습니다.
          output.csv_strings.csv,output.csv_run_count.csv , python.exe작업을
          했으며, 미니멜츠 초코 소다 - Google 검색 에 접속한 사실이 있습니다.
        </div>
      </Popover>
      </div>
    </div>
  );
};

export default EvidenceDetailsArtifact;
