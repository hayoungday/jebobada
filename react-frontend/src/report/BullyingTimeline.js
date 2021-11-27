import React, {useEffect, useState} from 'react';
import Timeline from '@mui/lab/Timeline';
import { makeStyles } from '@material-ui/styles';
import BullyingTimelineItem from './BullyingTimelineItem';
import BullyingScatterPlot from './BullyingScatterPlot';
import axios from 'axios'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'




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
    timelineContent2: {
        width: "100px",
        display: "inline-block",
        transform: "rotate(-90deg)",
        textAlign: "center",
        minWidth: 50
      },
    timelineIcon: {
      transform: "rotate(-90deg)"
    }
  });

const BullyingTimeline = (props) => {

    const classes = useStyles();
    const [bullyingevdi,Setbullyingevdi] = useState([])
    const [bullyingevdi2,Setbullyingevdi2] = useState([])
    const [bullyingdate,Setbullyingdate] = useState([])
    const [startDate, SetStartDate] = useState("");
    const [endDate, SetEndDate] = useState("");

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
        <Timeline className={classes.timeline} align="alternate">
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
        </Timeline>
        <br/>
        <h3>괴롭힘 빈도 요약</h3>
        증거 자료의 빈도수를 계산하여 반복성과 지속성을 나타냅니다.<br/>
        <BullyingScatterPlot
          data = {bullyingevdi2}
        />
        <br/>
        *빈도 : 매일 / 주 1회 이상 / 월 1회 이상 / 드물게 겪음
        <br/><br/>
      </div>
    )
}

export default BullyingTimeline;