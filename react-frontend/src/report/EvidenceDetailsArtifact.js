import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import HelpIcon from "@mui/icons-material/Help";
import Tooltip from "@mui/material/Tooltip";

const EvidenceDetailsArtifact = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [desc, setDesc] = useState(props.desc);
  const [descTmp, setDescTmp] = useState(props.desc);
  const [artifactAnalysis, setArtifactAnalysis] = useState(
    props.artifactAnalysis
  );

  const editDescTmp = (e) => {
    setDescTmp(e.target.value);
  };

  const editDesc = () => {
    let body = {
      _id: props.object_id,
      // artifactAnalysis: artifactAnalysisTmp,
      desc: descTmp,
    };
    axios.post("/EditArtifactReport", body);
    setDesc(descTmp);
  };

  const editTrue = () => {
    setEditMode(true);
  };

  const editFalse = () => {
    setEditMode(false);
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
        <div>
          {editMode === false ? (
            <div
              style={{
                border: "3px solid #E7E6E6",
                wordBreak: "break-all",
                display: "inline-block",
                padding: "2%",
                width: "70%",
              }}
            >
              {desc}
            </div>
          ) : (
            <div style={{ width: "70%" }}>
              <TextField
                fullWidth
                defaultValue={desc}
                multiline
                onChange={(e) => editDescTmp(e)}
              />
            </div>
          )}
        </div>
        <div>
          {editMode === false ? (
            <div>
              <Button
                variant="outlined"
                onClick={() => {
                  editTrue();
                }}
              >
                수정하기
              </Button>
            </div>
          ) : (
            <div>
              <Button
                variant="outlined"
                onClick={() => {
                  editFalse();
                  editDesc();
                  alert("수정되었습니다");
                }}
              >
                확인
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  editFalse();
                  alert("수정을 취소하였습니다");
                }}
              >
                취소
              </Button>
            </div>
          )}
          <br />
          <Accordion style={{ width: "85%" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>예시</Typography>
              <Tooltip
                title="컴퓨터 사용 기록 예시입니다. 피해 사실 기록에 활용해보세요!"
                placement="right"
              >
                <HelpIcon />
              </Tooltip>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{artifactAnalysis}</Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </Stack>
    </div>
  );
};

export default EvidenceDetailsArtifact;
