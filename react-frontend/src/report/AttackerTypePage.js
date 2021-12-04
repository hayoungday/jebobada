import React, {useEffect, useState} from 'react';
import {TableRow, TableCell, Table, TableHead, TableBody} from '@material-ui/core';
import {Link} from 'react-router-dom';
import axios from 'axios';
import ReportHeader from './ReportHeader';
import AttackerTimeline from './AttackerTimeline';
import AttackerScatterPlot from './AttackerScatterPlot';
import './reportHeader.css'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'



const AttackerTypePage = (props) => {

    const [attackertypes, Setattackertypes] = useState([])
    const [user,Setuser] = useState("")
    const [no, Setno] = useState(1)

    const getUser = async () => {
      await axios.get('/getuser').then((res)=>{
        console.log(res)
        Setuser(res.data.user)

        getAttackertype(res.data.user)
      })
    }

    const getAttackertype = (user_id) =>{
      let body={
        user: user_id,
      }

      axios.post("/attackertype",body).then((res)=>{
        Setattackertypes(res.data)
      })
    }

    useEffect(()=>{
        getUser();
    },[])



    return(
        <div className="flex-container">
          <div className="nav-item">
            <ReportHeader case_id={props.location.state.case_id}/>
          </div>
          <div className="comp-item">

            <h1>행위자별 괴롭힘 행위</h1>
            <p>행위자별 괴롭힘 피해 행위를 통해 특정 행위자에게서 어떠한 괴롭힘을 당했는지 알 수 있습니다.</p>
            
            <br/><br/><br/>
            {console.log(user)}
            
              
              {attackertypes.map((c)=>(
                // console.log(typeof c)
                // gettimelineEvdi(user,c)
                // return console.log()     
                <AttackerTimeline
                  type = {c}
                  user = {user}
                />
              ))}

              {attackertypes.map((c)=>(
                console.log(c)
              ))}            

          </div>

        </div>
    )
}

export default AttackerTypePage;