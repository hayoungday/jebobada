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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";

const EvidenceDetailsArtifact = (props) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = snackbar;

  const [editMode, setEditMode] = useState(false);
  const [desc, setDesc] = useState(props.desc);
  const [descTmp, setDescTmp] = useState(props.desc);
  const [artifactAnalysis, setArtifactAnalysis] = useState(
    props.artifactAnalysis
  );

  const doCopy = (text) => {
    if (!document.queryCommandSupported("copy")) {
      return alert("복사하기가 지원되지 않는 브라우저입니다.");
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.top = 0;
    textarea.style.left = 0;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

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

  const snackbarClick = (newState) => () => {
    setSnackbar({ open: true, ...newState });
    doCopy(artifactAnalysis);
  };

  const snackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div>
      <br/>
      <br/>
      <Stack direction="row" justifyContent="space-around" spacing={4}>
        <Stack direction="row" justifyContent="flex-start" spacing={2}>
          <span className="yoon_evidenceDetail-info">일시</span>
          <span className="yoon_evidenceDetail-infodesc">{props.date}</span>
        </Stack>

        <Stack direction="row" justifyContent="flex-start" spacing={2}>
          <span className="yoon_evidenceDetail-info">행위자</span>
          <span className="yoon_evidenceDetail-infodesc">
            {props.attacker.join(",")}
          </span>
        </Stack>

        <Stack direction="row" justifyContent="flex-start" spacing={2}>
          <span className="yoon_evidenceDetail-info">괴롭힘 유형</span>
          <span className="yoon_evidenceDetail-infodesc">{props.type}</span>
        </Stack>
      </Stack>
      <br />
      <br />
      <Stack direction="row" spacing={2} alignItems="center">
        <span className="yoon_evidenceDetail-desc">상세 설명</span>
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
                    editDesc();
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
          <div className="yoon_evidenceDetail-desc-textbox">{desc}</div>
        ) : (
          <div className="yoon_evidenceDetail-desc-edittextbox">
            <TextField
              fullWidth
              defaultValue={desc}
              multiline
              onChange={(e) => editDescTmp(e)}
              InputProps={{
                style: {
                  fontFamily: "NotoSansKR-Light",
                  fontSize: "21px",
                  padding: "2%",
                },
              }}
            />
          </div>
        )}
      </div>
      <br />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack direction="row" spacing={1} alignItems="center">
            <span className="yoon_evidenceDetail-tooltiptext">예시</span>
            <Tooltip
              placement="right"
              title={
                <Typography fontSize={15}>
                  컴퓨터 사용 기록 예시입니다. 피해 사실 기록에 활용해보세요!
                </Typography>
              }
            >
              <HelpIcon />
            </Tooltip>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <IconButton
            onClick={snackbarClick({
              vertical: "bottom",
              horizontal: "center",
            })}
          >
            <ContentCopyIcon />
          </IconButton>
          <span className="yoon_evidenceDetail-artifactanalysizetext">
            {artifactAnalysis}
          </span>

          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            onClose={snackbarClose}
            message="복사가 완료되었습니다!"
            key={vertical + horizontal}
            autoHideDuration={1500}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default EvidenceDetailsArtifact;
