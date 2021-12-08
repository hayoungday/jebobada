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
  width: 50,
  height: 50,
  borderRadius:50,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding:"20%"
}));


const AttackerTimeline = (props) => {

    // const classes = useStyles();
    const [Attackerevdi,SetAttackerevdi] = useState([])
    const [Attackerevdi2,SetAttackerevdi2] = useState([])
    const [startDate, SetStartDate] = useState("");
    const [endDate, SetEndDate] = useState("");
    const [freqItem, SetFreqItem] = useState("");

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
    const res2 = await axios.post('/attackertimeline',body2)
    SetAttackerevdi2(res2.data)
    console.log(Attackerevdi2)

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
            피해기간 <span className="num">{" "}{startDate.substr(0,10)}~{endDate.split("~")[1]}</span>
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
        <div style={{ border: "3px solid #5C7BDE", padding: "30px", width: "100%" }}>
      <Stepper alternativeLabel activeStep={100} connector={<ColorlibConnector/>}>
        {Attackerevdi.map((c) => (
          <Step style={{ textAlign: "center" }}>
            {c.date}
            <br></br>
            {c.filename}
            <StepLabel icon={<ColorlibStepIconRoot><SettingsIcon/></ColorlibStepIconRoot>}>
              <div style={{ marginTop: "-2%" }}>
                {c.attacker.join(", ")}
              </div>
            </StepLabel>
            {c.type.join(", ")}
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