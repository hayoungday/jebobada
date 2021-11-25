import React, {useEffect, useState} from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@material-ui/styles';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Paper from "@material-ui/core/Paper";
import axios from 'axios'



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

const BullyingTimelineItem = (props) => {

    const classes = useStyles();
    {console.log(props)}
    return(
      <div>
        <TimelineItem>
            <TimelineSeparator>
                <CheckCircleOutlineIcon
                    color="primary"
                    className={classes.timelineIcon}
                />
                <Paper className={classes.timelineContent2}>
                <Typography>
                    {props.date}<br/>
                    {props.filename}<br/>
                </Typography>
                 </Paper>
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent className={classes.timelineContentContainer}>
            <Paper className={classes.timelineContent}>
                <Typography>
                    [{props.attacker}]<br/>
                    ({props.type})<br/>
                </Typography>
            </Paper>
            </TimelineContent>
        </TimelineItem>
      </div>
    )
}

export default BullyingTimelineItem;