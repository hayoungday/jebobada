import React, {useEffect, useState} from 'react';
import {TableRow, TableCell, Table, TableHead, TableBody} from '@material-ui/core';
import {Link} from 'react-router-dom';
import axios from 'axios';
import ReportHeader from './ReportHeader';
import BullyingTimeline from './BullyingTimeline';
import BullyingScatterPlot from './BullyingScatterPlot';
import './reportHeader.css'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import Stack from "@mui/material/Stack";
import Header from '../components/Header';



const BullyingTypePage = (props) => {

    const [picevdi, Setpicevdi] = useState([])
    const [audevdi, Setaudevdi] = useState([])
    const [csvevdi, Setcsvevdi] = useState([])
    const [bullyingevdi,Setbullyingevdi] = useState([])
    const [bulltypes, Setbulltypes] = useState([])
    const [user,Setuser] = useState("")
    const [no, Setno] = useState(1)

    const getUser = async () => {
      await axios.get('/getuser').then((res)=>{
        console.log(res)
        Setuser(res.data.user)
        getbullyingtype(res.data.user)
      })
    }

    const getbullyingtype = (user_id) =>{
      let body={
        user: user_id,
      }

      axios.post("/bullyingtype",body).then((res)=>{
        Setbulltypes(res.data)
      })
    }

    useEffect(()=>{
        getUser();
    },[])



    return(
      <div>
        <Header />
        <div className="flex-container">
          <div className="nav-item">
            <ReportHeader case_id={props.location.state.case_id}/>
          </div>
          <div className="yoon_overview-container">
            
            <Stack direction="row" alignItems="center" spacing={6}>
              <span className="yoon_overview-title">괴롭힘 유형 분류</span>
              <br/>
              <span className="yoon_overview-tilte-desc">
              괴롭힘 유형별로 사건을 분류하여.
              <br/>
              유형별로 어떠한 괴롭힘을 당했는지 알 수 있습니다.
              </span>
            </Stack>
            <br/>
              
              {bulltypes.map((c)=>(
                // console.log(typeof c)
                // gettimelineEvdi(user,c)
                // return console.log()     
                <BullyingTimeline
                  type = {c}
                  user = {user}
                />
              ))}

              {bulltypes.map((c)=>(
                console.log(c)
              ))}            

          </div>

        </div>
      </div>
    )
}

export default BullyingTypePage;