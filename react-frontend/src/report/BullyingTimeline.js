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

    SetStartDate(res.data[0]['date'].substr(0,10))
    SetEndDate(res.data[res.data.length-1]['date'])

    const res2 = await axios.post('/bullyingtimeline',body2)
    Setbullyingevdi2(res2.data)
    console.log(bullyingevdi2)

  }

  const freq = [
    {label:"매일"},
    {label:"주 1회 이상"},
    {label:"월 1회 이상"},
    {label:"드물게 겪음"},
  ]

  useEffect(()=>{
    gettimelineEvdi();
  },[])

    {console.log(props)}
    return(
      <div>
        <h1>{props.type}</h1>
        {console.log(bullyingevdi)}
        <h3>괴롭힘 사건 요약</h3>
        괴롭힘 증거자료를 시간순으로 나타낸 결과입니다.<br/>

        <br />
        <label>
          피해기간 {startDate}~{endDate}
          {"  "}
        </label>
        <br/>

        <div
          style={{ border: "3px solid #5C7BDE", padding: "30px", width: "80%" }}
        >
      <Stepper alternativeLabel activeStep={100} connector={<ColorlibConnector />}>
        {bullyingevdi.map((c) => (
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

        {/* <Timeline className={classes.timeline} align="alternate">
        {bullyingevdi.map((c)=>(
                // console.log(typeof c)
                // gettimelineEvdi(user,c)
                // return console.log()
          <BullyingTimelineItem
            date = {c.date}
            filename = {c.filename}
            attacker = {c.attacker}
            type = {c.type}
          />
        ))}
        </Timeline> */}
        <br/>
        <h3>괴롭힘 빈도 요약</h3>
        
        증거 자료의 빈도수를 계산하여 반복성과 지속성을 나타냅니다.<br/>
        <BullyingScatterPlot
          data = {bullyingevdi2}
        />
        <br/><br/>
        <Autocomplete
          disablePortal
          options={freq}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="괴롭힘 빈도" />}
          onInputChange={(e,newInputValue)=>onComboHandle(newInputValue)}
        /> 
        <br/><br/>
        {freqItem} {props.type}과(와) 관련된 괴롭힘을 당했습니다.
        
        <br/><br/>
        *빈도 : 매일 / 주 1회 이상 / 월 1회 이상 / 드물게
        <br/><br/>
      </div>
    )
}

export default BullyingTimeline;