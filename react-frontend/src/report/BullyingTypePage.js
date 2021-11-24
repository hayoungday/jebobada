import React, {useEffect, useState} from 'react';
import {TableRow, TableCell, Table, TableHead, TableBody} from '@material-ui/core';
import {Link} from 'react-router-dom';
import axios from 'axios';
import ReportHeader from './ReportHeader';
import BullyingTimeline from './BullyingTimeline';
import Timeline from '@mui/lab/Timeline';
import { makeStyles } from '@material-ui/styles';
import './reportHeader.css'


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

const BullyingTypePage = (props) => {

    const [picevdi, Setpicevdi] = useState([])
    const [audevdi, Setaudevdi] = useState([])
    const [csvevdi, Setcsvevdi] = useState([])
    const [bullyingevdi,Setbullyingevdi] = useState([])
    const [bulltypes, Setbulltypes] = useState([])
    const [user,Setuser] = useState("")
    const [no, Setno] = useState(1)

    const classes = useStyles();


    const getUser = async () => {
      await axios.get('/getuser').then((res)=>{
        console.log(res)
        Setuser(res.data.user)
        getPicEvid(res.data.user)
        getAudEvid(res.data.user)
        getCsvEvdi(res.data.user)
        getbullyingtype(res.data.user)
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

    const getCsvEvdi =(user_id)=>{
      let body = {
        user: user_id,
      }
      axios.post('/csvevdi',body).then((res)=>{
        Setcsvevdi(res.data)
      })
    }

    const gettimelineEvdi = async (user_id,type) => {
      let body = {
        user: user_id,
        type: type,
      }

      const res = await axios.post('/bullyingtimeline',body)
      
      Setbullyingevdi(res.data)

      // .then((res)=>{
      //   Setbullyingevdi(res.data)
      //   data = res.data
      //   console.log(type)
      //   console.log(res.data)
      // })

      return(
        <div>
          hi
        </div>
      )
    }

    const getbullyingtype = (user_id) =>{
      let body={
        user: user_id,
      }

      axios.post("/bullyingtype",body).then((res)=>{
        Setbulltypes(res.data)
        
        // res.data.map((c)=>(
        //   gettimelineEvdi(c,user)
        // ))

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
            {console.log(bulltypes)}
            
              
              {bulltypes.map((c)=>(
                // console.log(typeof c)
                // gettimelineEvdi(user,c)
                // return console.log()
                <Timeline className={classes.timeline} align="alternate">
                <BullyingTimeline
                  type = {c}
                  user = {user}
                />
                </Timeline>
              ))}

              {bulltypes.map((c)=>(
                console.log(c)
              ))}

            

            {/* <Timeline className={classes.timeline} align="alternate">
            
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
            </Timeline> */}

          </div>

        </div>
    )
}

export default BullyingTypePage;