import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import { Link } from "react-router-dom";
import axios from "axios";
import "./reportHeader.css";
import ReportHeader from "./ReportHeader";
import OverviewTimeline from "./OverviewTimeline";
import Timeline from "@mui/lab/Timeline";
import { makeStyles } from "@material-ui/styles";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 69,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#8FAADC",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:"#F0F0F4",
  zIndex: 2,
  color: "#4B64D4",
  width: 100,
  height: 50,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding:"20%"
}));

function returnType(props){
  const bullyingType_language=["폭언","모욕","협박","비하"]
  const bullyingType_work=["무시","정보차단","차단","배제","사적지시","전가","업무제외","SNS","초과근무","건의","감시","사직종용","제출강요","차별","사비"]
  const bullyingType_nonwork=["행사","장기자랑 강요","강요","후원강요","휴가","육아휴직","모임","실업급여"]
  const bullyingType_group=["따돌림","소문","비밀","태움"]
  const bullyingType_sexual=["성희롱"]
  
  if(bullyingType_language.includes(props)){
    return "bullyingType_language"
  }
  else if(bullyingType_work.includes(props)){
    return "bullyingType_work"
  }
  else if(bullyingType_nonwork.includes(props)){
    return "bullyingType_nonwork"
  }
  else if(bullyingType_group.includes(props)){
    return "bullyingType_group"
  }
  else if(bullyingType_sexual.includes(props)){
    return "bullyingType_sexual"
  }
}

const barGraph=["#869DE6","#8FAADC","#B3C5E5","#DEE5F8","#DEEBF7"] 

const Overview = (props) => {
  const [evidence, Setevidence] = useState([]);
  const [startDate, SetStartDate] = useState("");
  const [endDate, SetEndDate] = useState("");
  const [attackers, SetAttackers] = useState([]);
  const [bullying, SetBullying] = useState([]);
  const [requirement,SetRequirement]=useState({});
  const [case_id,SetCaseId]=useState(props.location.state.case_id)

  console.log(requirement)

  const requirementUpdate=(e)=>{
    console.log(e.currentTarget.id + ":" + e.currentTarget.checked);
    SetRequirement({...requirement,[`${e.target.id}`]: e.currentTarget.checked });
    updateCaseRequirement(e)
  }

  const updateCaseRequirement=(e)=>{
    let body={
      case_id:case_id,      
      requirement:{...requirement,[`${e.target.id}`]: e.currentTarget.checked}}
    axios.post("/updateCaseRequirement",body)
  }

  const getCaseInfo=async()=>{
    let body={
      case_id:case_id
    }
    axios.post("/loadCaseInfo",body).then((res)=>
    SetRequirement(res.data[0].requirement))
  }

  const getUser = async () => {
    await axios.get("/getuser").then((res) => {
      getEvidences(res.data.user);
    });
  };

  const getEvidences = (user_id) => {
    getCaseInfo()
    let body = {
      user: user_id,
      type: "all",
    };
    axios.post("/getallevidence", body).then((res) => {
      Setevidence(res.data);
      console.log(res.data)
      //console.log(res.data[0]['date'].substr(0,10))
      //console.log(res.data[res.data.length-1]['date'])
      SetStartDate(res.data[0]['date'].substr(0,10))
      SetEndDate(res.data[res.data.length-1]['date'])
      res.data.map((c)=>{
        SetAttackers(attackers=>[...attackers,c.attacker])
        c.type.map((t)=>{
          SetBullying(bullying=>[...bullying,t])
        })
      })
    });
  };
  
  useEffect(() => {
    getUser();
  },[]);

  let tmp=bullying.reduce((c,i)=>{
    c[i]=(c[i]||0)+1;
    return c;
  },{});

  tmp=JSON.parse(JSON.stringify(tmp))
  // console.log(tmp)

  // console.log(JSON.parse(tmp).비하)
  // console.log(Object.keys(tmp)) // ->유형 이름으로 이루어진 키들

  for(const [key,value] of Object.entries(tmp)){
    console.log((`${key}:${value}`))
  }
  return (
    <div className="flex-container">
      <div className="nav-item">
        <ReportHeader case_id={case_id}/>
      </div>
      <div className="comp-item">
        <h1>사건 개요</h1>
        <br />
        <h5>직장 내 괴롭힘 사건에 대한 개요입니다.</h5>
        <h5>괴롭힘 유형별 건수와 사건을 요약하여 나타냅니다.</h5>
        <br />
        <label>
          피해기간 {startDate}~{endDate}
          {"  "}
        </label>
        <br></br>
        <label>행위자</label>
        <br></br>
        {attackers.join(", ")}
        <br />
        <br />
        <h3>괴롭힘 유형별 건수</h3>
        전체 증거물들에 대한 괴롭힘 유형별 건수입니다.
        <br />
        <br />
        괴롭힘 증거 자료 {evidence.length}건 중<br />
        <br />
        <br />

        <div style={{ width: "80%" }}>
          <Table
            style={{
              tableLayout: "fixed",
              wordBreak: "break-all",
              wordWrap: "break-word",
            }}
          >
            <colgroup>
              {Object.entries(tmp).map(([key, value],bar_cnt) => (
                
                <col
                  style={{
                    width: value + "%",
                    backgroundColor:
                      barGraph[(bar_cnt+1)%5],
                  }}
                />
              ))}
            </colgroup>
            <TableHead style={{ height: 10 }}>
              {Object.entries(tmp).map(([key, value]) => (
                <TableCell align="center">
                  <Typography variant="body1" style={{ fontWeight: "bolder" }}>
                    {key}
                  </Typography>
                  <Typography variant="subtitle2">{value}건</Typography>
                </TableCell>
              ))}
            </TableHead>
          </Table>
        </div>
        <br></br>
        <h3>괴롭힘 사건 요약</h3>
        괴롭힘 증거자료를 시간순으로 나타낸 결과입니다.
        <br />
        <br />
        <div
          style={{ border: "3px solid #5C7BDE", padding: "30px", width: "80%" }}
        >
          <Stepper
            alternativeLabel
            activeStep={100}
            connector={<ColorlibConnector />}
          >
            {evidence.map((label) => (
              <Step style={{ textAlign: "center" }} key={label.date}>
                {label.date.substr(0, 10)}
                <br></br>
                {label.attacker}
                <StepLabel
                  icon={
                    <ColorlibStepIconRoot>
                    <div>
                      <img  src={"./static/react/type_icons/"+returnType(label.type[0])+".png"} />
                    </div></ColorlibStepIconRoot>
                  }
                >
                  <div>{label.filename}</div>
                </StepLabel>
                {label.type.join(", ")}
              </Step>
            ))}
          </Stepper>
        </div>
        <br></br>
        <br></br>
        
        <h1>요구사항</h1>
        <h5>신고기관에 바라는 요구 사항을 선택하세요.</h5>
        <br />
        <div>{console.log(requirement)}</div>
        <FormGroup>
          <Stack direction="row" spacing={6}>
            <FormControlLabel
              control={
                <Checkbox
                  id="seperate"
                  sx={{
                    "& .MuiSvgIcon-root": { fontSize: 28, color: "#4B64D4" },
                  }}
                  
                  
                  checked={requirement["seperate"]}
                  onChange={(e) => {
                    requirementUpdate(e)
                  }}
                />
              }
              label={
                <span style={{ fontSize: "22px" }}>행위자로부터 분리</span>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  id="personnel"
                  sx={{
                    "& .MuiSvgIcon-root": { fontSize: 28, color: "#4B64D4" },
                  }}
                  
                  checked={requirement["personnel"]}
                  onChange={(e) => {
                    requirementUpdate(e)
                  }}
                />
              }
              label={
                <span style={{ fontSize: "22px" }}>징계 등 인사 조치</span>
              }
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  id="agree"
                  sx={{
                    "& .MuiSvgIcon-root": { fontSize: 28, color: "#4B64D4" },
                  }}
                  checked={requirement["agree"]}
                  onChange={(e) => {
                    requirementUpdate(e)
                  }}
                />
              }
              label={
                <span style={{ fontSize: "22px" }}>행위자의 사과 등 합의</span>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  id="paidleave"
                  sx={{
                    "& .MuiSvgIcon-root": { fontSize: 28, color: "#4B64D4" },
                  }}
                  checked={requirement["paidleave"]}
                  onChange={(e) => {
                    requirementUpdate(e)
                  }}
                />
              }
              label={<span style={{ fontSize: "22px" }}>유급휴가</span>}
            />
          </Stack>
          <FormControlLabel
            control={
              <Checkbox
                id="etc"
                sx={{
                  "& .MuiSvgIcon-root": { fontSize: 28, color: "#4B64D4" },
                }}
                checked={requirement["etc"]}
                onChange={(e) => {
                  requirementUpdate(e)
                }}
              />
            }
            label={<span style={{ fontSize: "22px" }}>기타</span>}
          />
        </FormGroup>
        <br></br>
        <br></br>
        
        
      </div>
    </div>
  );
};

export default Overview;