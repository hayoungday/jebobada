import React, {useEffect, useState} from 'react';
import {TableRow, TableCell, Table, TableHead, TableBody} from '@material-ui/core';
import {Link} from 'react-router-dom';
import axios from 'axios';
import AllEvidenceTable from './allEvidenceTable';
import './reportHeader.css'
import ReportHeader from './ReportHeader';

const BullyingTypePage = (props) => {

    const [evidence, Setevidence] = useState([])
    const [no, Setno] = useState(1)

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
        <div>
            <h1>괴롭힘 유형 분류</h1>
            <p>괴롭힘 유형별로 증거 자료를 나타냅니다. 증거 자료에 대한 속성 값과 피해사실을 기록할 수 있습니다.</p>

            <br/><br/><br/>

            

        </div>
    )
}

export default BullyingTypePage;