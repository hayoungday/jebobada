import React, {useEffect, useState} from 'react';
// import Timeline from '@mui/lab/Timeline';
// import { makeStyles } from '@material-ui/styles';
// import AttackerTimelineItem from './AttackerTimelineItem';
import AttackerScatterPlot from './AttackerScatterPlot';
import axios from 'axios'
// import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import Stack from "@mui/material/Stack";
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import SettingsIcon from '@mui/icons-material/Settings';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { Autocomplete } from '@mui/material';
import { TextField } from '@material-ui/core';
import './report.css'

function returnType(props) {
  const bullyingType_language = ["폭언", "모욕", "협박", "비하"];
  const bullyingType_work = [
    "무시",
    "정보차단",
    "차단",
    "배제",
    "사적지시",
    "전가",
    "업무제외",
    "SNS",
    "초과근무",
    "건의",
    "감시",
    "사직종용",
    "제출강요",
    "차별",
    "사비",
  ];
  const bullyingType_nonwork = [
    "행사",
    "장기자랑 강요",
    "강요",
    "후원강요",
    "휴가",
    "육아휴직",
    "모임",
    "실업급여",
  ];
  const bullyingType_group = ["따돌림", "소문", "비밀", "태움"];
  const bullyingType_sexual = ["성희롱"];
  const bullyinType_physics=["폭행"]

  if (bullyingType_language.includes(props)) {
    return "bullyingType_language";
  } else if (bullyingType_work.includes(props)) {
    return "bullyingType_work";
  } else if (bullyingType_nonwork.includes(props)) {
    return "bullyingType_nonwork";
  } else if (bullyingType_group.includes(props)) {
    return "bullyingType_group";
  } else if (bullyingType_sexual.includes(props)) {
    return "bullyingType_sexual";
  }
  else if(bullyinType_physics.includes(props)){
    return "bullyingType_physics";
  }
}

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
  backgroundColor: "white",
  zIndex: 2,
  color: "#4B64D4",
  width: 100,
  height: 50,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20%",
}));


const AttackerTimeline = (props) => {

    // const classes = useStyles();
    const [Attackerevdi,SetAttackerevdi] = useState([])
    const [Attackerevdi2,SetAttackerevdi2] = useState([])
    const [startDate, SetStartDate] = useState("");
    const [endDate, SetEndDate] = useState("");
    const [freqItem, SetFreqItem] = useState("");
    const [date, SetDate] = useState("");


    const onComboHandle = (item) => {
      SetFreqItem(item)
    }

    const gettimelineEvdi = async () => {
      let body = {
        user: props.user,
        type: props.type,
        scatter: "no",

      }

    const res = await axios.post('/attackertimeline',body)
    
    SetStartDate(res.data[0]['date'].substr(0,10))
    SetEndDate(res.data[res.data.length-1]['date'])

    SetAttackerevdi(res.data)

    let body2 = {
      user: props.user,
      type: props.type,
      scatter: "yes",
    }

    if (res.data[0].filetype =="컴퓨터 증거"){
      // SetStartDate(res.data[0]['date'].substr(0,10))
      // SetEndDate(res.data[res.data.length-1]['date'].split("~")[1])
      if (res.data[res.data.length-1].filetype=="컴퓨터 증거"){
        SetDate(res.data[0]['date'].substr(0,10)+"~"+res.data[res.data.length-1]['date'].split("~")[1])
      } else{
        SetDate(res.data[0]['date'].substr(0,10)+"~"+res.data[res.data.length-1]['date'])
      }
      
    } else{
      // SetStartDate(res.data[0]['date'].substr(0,10))
      // SetEndDate(res.data[res.data.length-1]['date'].split("~")[1])
      if(res.data[res.data.length-1].filetype=="컴퓨터 증거"){
        SetDate(res.data[0]['date']+"~"+res.data[res.data.length-1]['date'].split("~")[1])
      }else{
        SetDate(res.data[0]['date']+"~"+res.data[res.data.length-1]['date'])
      }
    }

    const res2 = await axios.post('/attackertimeline',body2)
    SetAttackerevdi2(res2.data)
    console.log(props.type,Attackerevdi2)

  }

  const freq = [
    {label:"매일"},
    {label:"주 1회 이상"},
    {label:"월 1회 이상"},
    {label:"드물게"},
  ]

  useEffect(()=>{
    gettimelineEvdi();
  },[])

    {console.log(props)}
    return(
      <div>
        <br/>
        <Stack direction="row" alignItems="center" spacing={6}>
          <div className="title_name_box">{props.type}</div>
          <span className="title_attack_date">
            피해기간 <span className="num">{date}</span>
          </span>
        </Stack>
        <br/>
        <Stack direction="row" alignItems="center" spacing={6}>
          <sapn className="yoon_overview-subtitle">괴롭힘 사건 요약</sapn>
          <span className="yoon_overview-subtitle-desc">
            괴롭힘 증거자료를 시간순으로 나타낸 결과입니다.
          </span>
        </Stack>
        <br/>
        <div style={{ border: "1.5px solid #294379", padding: "30px", width: "100%" }}>
      <Stepper alternativeLabel activeStep={100} connector={<ColorlibConnector/>}>
        {Attackerevdi.map((c) => (
          <Step style={{ textAlign: "center" }} key={c.date}>
            <span className="yoon_overview-timeline-date">
              {c.date.substr(0,10)}
            </span>
              <br></br>
              {c.attacker}
            
            <StepLabel icon={<ColorlibStepIconRoot><div>
                        <img
                          src={
                            "./static/react/type_icons/" +
                            returnType(c.type[0]) +
                            ".png"
                          }
                        />
                      </div></ColorlibStepIconRoot>}>
                      <div>{c.filename}</div>
            </StepLabel>
            <span className='yoon_overview-timeline-type'>{c.type.join(", ")}</span>
            {/* <br></br> */}
          </Step>
        ))}
      </Stepper>
      </div>
        <br/><br/>
        <Stack direction="row" alignItems="center" spacing={6}>
          <sapn className="yoon_overview-subtitle">괴롭힘 빈도 요약</sapn>
          <span className="yoon_overview-subtitle-desc">
          증거 자료의 빈도수를 계산하여 반복성과 지속성을 나타냅니다.
          </span>
        </Stack>
        <br/>

        <AttackerScatterPlot data = {Attackerevdi2}/>
        
        <Autocomplete
          disablePortal
          options={freq}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="괴롭힘 빈도" />}
          onInputChange={(e,newInputValue)=>onComboHandle(newInputValue)}
        /> 
        <br/>
        <span className="contents_box">
          {props.type}에게 <div className="term_contents_box">*{freqItem}</div> 주기적으로 괴롭힘을 당했습니다.
        </span>

        <br/>
        <span className="term_contents_desc">
          *빈도 : 매일 / 주 1회 이상 / 월 1회 이상 / 드물게 겪음<br/>
          (직장 내 괴롭힘은 주로 반복적이고 지속적인 행위를 바탕으로 인정됩니다.)
        </span>
        <br/><br/><br/><br/>
      </div>
    )
}

export default AttackerTimeline;