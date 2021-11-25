import React, {useEffect, useState} from 'react';
import Timeline from '@mui/lab/Timeline';
import { makeStyles } from '@material-ui/styles';
import AttackerTimelineItem from './AttackerTimelineItem';
import AttackerScatterPlot from './AttackerScatterPlot';
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

const AttackerTimeline = (props) => {

    const classes = useStyles();
    const [Attackerevdi,SetAttackerevdi] = useState([])
    const [Attackerevdi2,SetAttackerevdi2] = useState([])

    const gettimelineEvdi = async () => {
      let body = {
        user: props.user,
        type: props.type,
        scatter: "no",

      }

    const res = await axios.post('/attackertimeline',body)
    
    SetAttackerevdi(res.data)

    let body2 = {
      user: props.user,
      type: props.type,
      scatter: "yes",
    }
    const res2 = await axios.post('/attackertimeline',body2)
    SetAttackerevdi2(res2.data)
    console.log(Attackerevdi2)

  }

  useEffect(()=>{
    gettimelineEvdi();
  },[])

    {console.log(props)}
    return(
      <div>
        <h1>{props.type}</h1>
        {console.log(Attackerevdi)}
        <Timeline className={classes.timeline} align="alternate">

        {Attackerevdi.map((c)=>(
                // console.log(typeof c)
                // gettimelineEvdi(user,c)
                // return console.log()
          <AttackerTimelineItem
            date = {c.date}
            filename = {c.filename}
            attacker = {c.attacker}
            type = {c.type}
          />
        ))}
        </Timeline>
        <br/>
        <AttackerScatterPlot
          data = {Attackerevdi2}
        />
        <br/><br/>
      </div>
    )
}

export default AttackerTimeline;