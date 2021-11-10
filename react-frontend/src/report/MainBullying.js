import React, {useEffect, useState} from 'react';
import {TableRow, TableCell, Table, TableHead, TableBody} from '@material-ui/core';
import {Link} from 'react-router-dom';
import axios from 'axios';
import './reportHeader.css'
import ReportHeader from './ReportHeader'



const MainBullying = () => {

const [evidence, Setevidence] = useState([])
const [startDate, SetStartDate] = useState("2021-03-15")
const [endDate, SetEndDate] = useState("2021-05-01")
const [attackers, setAttackers] = useState(["윤승구","이호준"])
const [bullying, setBullying] = useState(["폭행","사적지시"])


    return(
        <div className="flex-container">
        <div className="nav-item">
          <ReportHeader/>
        </div>
        <div className="comp-item">
          <h1>핵심 피해 기록</h1>
          <h5>피해 기록 중 핵심 피해 사실에 대한 기록을 요약한 내용입니다.</h5>

        <button>수정</button>
        <button>확인</button>
        <p/>

        제가 괴롭힘 피해를 당한 기간은 <span style={{backgroundColor: "#F6BB42"}}>{startDate} ~ {endDate}</span> 입니다.<p/>
        위의 기간동안 <span style={{backgroundColor: "#F6BB42"}}>{attackers.join(", ")}</span> 에게 괴롭힘 피해를 당했습니다.<p/>
        피해 당한 괴롭힘 유형은  <span style={{backgroundColor: "#F6BB42"}}>{bullying.join(", ")}</span> 입니다.
        <br/><br/><br/>

        다음은 핵심 증거에 대한 피해 사실을 기록한 내용입니다.<br/><br/>

    
        </div>
      </div>
    )
}

export default MainBullying;