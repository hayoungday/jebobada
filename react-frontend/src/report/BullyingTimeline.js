import React, {useEffect, useState} from 'react';
import BullyingScatterPlot from './BullyingScatterPlot';
import axios from 'axios'
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import SettingsIcon from '@mui/icons-material/Settings';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { Autocomplete } from '@mui/material';
import { TextField } from '@material-ui/core';
import './report.css'
import Stack from "@mui/material/Stack";



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

const BullyingTimeline = (props) => {

    const [bullyingevdi,Setbullyingevdi] = useState([])
    const [bullyingevdi2,Setbullyingevdi2] = useState([])
    const [bullyingdate,Setbullyingdate] = useState([])
    const [startDate, SetStartDate] = useState("");
    const [endDate, SetEndDate] = useState("");
    const [date, SetDate] = useState("");

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

    const res = await axios.post('/bullyingtimeline',body)
    
    Setbullyingevdi(res.data)

    let body2 = {
      user: props.user,
      type: props.type,
      scatter: "yes",
    }
    console.log(res.data)
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
  
    const res2 = await axios.post('/bullyingtimeline',body2)
    Setbullyingevdi2(res2.data)
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
            {console.log("피해기간 ",{date})}
          </span>
        </Stack>

        <br/>
        <Stack direction="row" alignItems="center" spacing={6}>
          <sapn className="yoon_overview-subtitle">괴롭힘 사건 요약</sapn>
          <span className="yoon_overview-subtitle-desc">
            괴롭힘 증거자료를 시간순으로 나타낸 결과입니다.
          </span>
        </Stack>
        <br />

        <div
          style={{ border: "3px solid #5C7BDE", padding: "30px", width: "100%" }}
        >
      <Stepper alternativeLabel activeStep={100} connector={<ColorlibConnector />}>
        {bullyingevdi.map((c) => (
          <Step style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "1%" }}>
              {c.date}
              <br></br>
              {c.filename}
            </div>
            <StepLabel icon={<ColorlibStepIconRoot><SettingsIcon/></ColorlibStepIconRoot>}>
              <div style={{ marginTop: "1%" }}>
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

        <BullyingScatterPlot data = {bullyingevdi2}/>

        <Autocomplete
          disablePortal
          options={freq}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="괴롭힘 빈도" />}
          onInputChange={(e,newInputValue)=>onComboHandle(newInputValue)}
        />
        <br/>
        <span className="contents_box">
          <div className="term_contents_box">*{freqItem}</div> {props.type}과(와) 관련된 괴롭힘을 당했습니다.
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

export default BullyingTimeline;