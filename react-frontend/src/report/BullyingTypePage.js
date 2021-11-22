import React, {useEffect, useState} from 'react';
import {TableRow, TableCell, Table, TableHead, TableBody} from '@material-ui/core';
import {Link} from 'react-router-dom';
import axios from 'axios';
import AllEvidenceTable from './allEvidenceTable';
import './reportHeader.css'
import ReportHeader from './ReportHeader';

const BullyingTypePage = (props) => {

    const [picevdi, Setpicevdi] = useState([])
    const [audevdi, Setaudevdi] = useState([])
    const [csvevdi, Setcsvevdi] = useState([])
    const [no, Setno] = useState(1)

    const getUser = async () => {
      await axios.get('/getuser').then((res)=>{
        getPicEvid(res.data.user)
        getAudEvid(res.data.user)
      })
    }

    const getPicEvid =(user_id)=>{
      
      let body = {
          user: user_id,
          type: "pic",
      }
      axios.post('/ismainevdi',body).then((res)=>{
        Setpicevdi(res.data)

      })
    }

    const getAudEvid =(user_id)=>{
      
      let body = {
          user: user_id,
          type: "aud",
      }
      axios.post('/ismainevdi',body).then((res)=>{
        Setaudevdi(res.data)
      })
    }

    const getCsvEvdi =()=>{
      let body = {
        user: user_id,
      }
      axios.post('/csvevdi',body).then((res)=>{
        Setcsvevdi(res.data)
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

          <h1>괴롭힘 유형 분류</h1>
          <p>괴롭힘 유형별로 증거 자료를 나타냅니다. 증거 자료에 대한 속성 값과 피해사실을 기록할 수 있습니다.</p>
          
          <br/><br/><br/>

          </div>

        </div>
    )
}

export default BullyingTypePage;