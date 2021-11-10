import React, {useEffect, useState} from 'react';
import {TableRow, TableCell, Table, TableHead, TableBody} from '@material-ui/core';
import {Link} from 'react-router-dom';
import axios from 'axios';
import './reportHeader.css'
import ReportHeader from './ReportHeader'
import OverviewTimeline from './OverviewTimeline';
import Timeline from '@mui/lab/Timeline';
import { makeStyles } from '@material-ui/styles';


const useStyles = makeStyles({
    timeline: {
      transform: "rotate(90deg)",
      height: '200px'
    },
    timelineContentContainer: {
      textAlign: "left"
    },
    timelineContent: {
      display: "inline-block",
      transform: "rotate(-90deg)",
      textAlign: "center",
      minWidth: 50
    },
    timelineIcon: {
      transform: "rotate(-90deg)"
    }
  });

const Overview = () => {

    const [evidence, Setevidence] = useState([])
    const [startDate, SetStartDate] = useState("2021-03-15")
    const [endDate, SetEndDate] = useState("2021-05-01")
    const [attackers, setAttackers] = useState(["윤승구","이호준"])
    const [bullying, setBullying] = useState(["폭행","사적지시"])

    const classes = useStyles();

    const getUser = async () => {
        await axios.get('/getuser').then((res)=>{
          getEvidences(res.data.user)
        })
      }
  
    const getEvidences =(user_id)=>{
    
    let body = {
        user: user_id,
        type: "all",
    }
    axios.post('/getallevidence',body).then((res)=>{
        Setevidence(res.data)

    })
    }

    useEffect(()=>{
        getUser();
    },[])


    return(
        <div className="flex-container">
        <div className="nav-item">
            <ReportHeader/>
        </div>
        <div className="comp-item">
            <h1>사건 개요</h1><br/>
            <h5>직장 내 괴롭힘 사건에 대한 개요입니다.</h5>
            <h5>괴롭힘 유형별 건수와 사건을 요약하여 나타냅니다.</h5><br/>
            
            <label>피해기간 {startDate}~{endDate}{"  "}</label>
            <label>행위자 {attackers.join(", ")}</label>
            <br/><br/>

            <h3>괴롭힘 유형별 건수</h3>
            전체 증거물들에 대한 괴롭힘 유형별 건수입니다.<br/><br/>

            괴롭힘 증거 자료 15건 중<br/>
            

            <br/><br/>
            
            <h3>괴롭힘 사건 요약</h3>
            괴롭힘 증거자료를 시간순으로 나타낸 결과입니다.<br/><br/>
            
            <Timeline className={classes.timeline} align="alternate">
            
            {evidence.map((c)=>(
                <OverviewTimeline
                    date = {c.date}
                    filename = {c.filename}
                    attacker = {c.attacker}
                    type = {c.type}
                />
            ))}

            {evidence.map((c)=>(
                console.log(c)
            ))}
            </Timeline>
            <h1>요구사항</h1>
            <h5>신고기관에 바라는 요구 사항을 선택하세요.</h5><br/>
            <button>수정</button>
            <button>확인</button>


        </div>
        </div>
    )
}

export default Overview;