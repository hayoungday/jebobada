import React, {useEffect, useState} from 'react';
import {TableRow, TableCell, Table, TableHead, TableBody} from '@material-ui/core';
import {Link} from 'react-router-dom';
import axios from 'axios';
import './reportHeader.css'
import ReportHeader from './ReportHeader'
import MainBullyingDetail from './MainBullyingDetail';



const MainBullying = (props) => {

const [evidence, Setevidence] = useState([])
const [startDate, SetStartDate] = useState("");
const [endDate, SetEndDate] = useState("");
const [attackers, SetAttackers] = useState([])
const [bullying, SetBullying] = useState([])

const getUser = async () => {
  await axios.get("/getuser").then((res) => {
    getEvidences(res.data.user);
  });
};

const getEvidences = (user_id) => {
  let body = {
    user: user_id,
    type: "all",
  };
  axios.post("/ismainevdi", body).then((res) => {
    Setevidence(res.data);
    console.log(res.data)

    SetStartDate(res.data[0]['date'].substr(0,10))
    SetEndDate(res.data[res.data.length-1]['date'])

    res.data.map((c)=>{

      c.attacker.map((a)=>{
        SetAttackers(attackers=>[...attackers,a])
      })

      c.type.map((t)=>{
        SetBullying(bullying=>[...bullying,t])
      })
    })

  });
};

useEffect(() => {
  getUser();
},[]);

  return(
      <div className="flex-container">
      <div className="nav-item">
        <ReportHeader case_id={props.location.state.case_id}/>
      </div>
      <div className="comp-item">
        <h1>핵심 피해 기록</h1>
        <h5>피해 기록 중 핵심 피해 사실에 대한 기록을 요약한 내용입니다.</h5>

      <button>수정</button>
      <button>확인</button>
      <p/>

      제가 괴롭힘 피해를 당한 기간은 <span style={{backgroundColor: "#F6BB42"}}>{startDate} ~ {endDate}</span> 입니다.<p/>
            
      위의 기간동안 <span style={{backgroundColor: "#F6BB42"}}>{Array.from(new Set(attackers)).join(", ")}</span> 에게 괴롭힘 피해를 당했습니다.<p/>
      
      피해 당한 괴롭힘 유형은  <span style={{backgroundColor: "#F6BB42"}}>{Array.from(new Set(bullying)).join(", ")}</span> 입니다.
      <br/><br/><br/>

      다음은 핵심 증거에 대한 피해 사실을 기록한 내용입니다.<br/><br/>

      {evidence.map((c,index)=>{
        return(
          <MainBullyingDetail
            attacker = {c.attacker}
            date = {c.date}
            location = {c.location}
            bullying = {c.type}
            desc = {c.desc}
            idx = {index}
          />
        )
      })}
  
      </div>
    </div>
  )
}

export default MainBullying;