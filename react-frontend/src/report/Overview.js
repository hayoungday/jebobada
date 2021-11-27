import React, { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import { Link } from "react-router-dom";
import axios from "axios";
import "./reportHeader.css";
import ReportHeader from "./ReportHeader";
import OverviewTimeline from "./OverviewTimeline";
import Timeline from "@mui/lab/Timeline";
import { makeStyles } from "@material-ui/styles";
import Typography from "@mui/material/Typography";

const barGraph=["#869DE6","#8FAADC","#B3C5E5","#DEE5F8","#DEEBF7"] 

const useStyles = makeStyles({
  timeline: {
    transform: "rotate(90deg)",
    height: "200px",
  },
  timelineContentContainer: {
    textAlign: "left",
  },
  timelineContent: {
    display: "inline-block",
    transform: "rotate(-90deg)",
    textAlign: "center",
    minWidth: 50,
  },
  timelineIcon: {
    transform: "rotate(-90deg)",
  },
});

const Overview = () => {
  const [evidence, Setevidence] = useState([]);
  const [startDate, SetStartDate] = useState("");
  const [endDate, SetEndDate] = useState("");
  const [attackers, SetAttackers] = useState([]);
  const [bullying, SetBullying] = useState([]);

  const classes = useStyles();

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
    axios.post("/getallevidence", body).then((res) => {
      Setevidence(res.data);
      console.log(res.data)
      //console.log(res.data[0]['date'].substr(0,10))
      //console.log(res.data[res.data.length-1]['date'])
      SetStartDate(res.data[0]['date'].substr(0,10))
      SetEndDate(res.data[res.data.length-1]['date'])
      res.data.map((c)=>{
        SetAttackers(attackers=>[...attackers,c.attacker])
        c.type.map((t)=>{
          SetBullying(bullying=>[...bullying,t])
        })
      })
    });
  };
  
  useEffect(() => {
    getUser();
  },[]);

  let tmp=bullying.reduce((c,i)=>{
    c[i]=(c[i]||0)+1;
    return c;
  },{});

  tmp=JSON.parse(JSON.stringify(tmp))
  console.log(tmp)

  // console.log(JSON.parse(tmp).비하)
  console.log(Object.keys(tmp)) // ->유형 이름으로 이루어진 키들

  for(const [key,value] of Object.entries(tmp)){
    console.log((`${key}:${value}`))
  }
  return (
    <div className="flex-container">
      <div className="nav-item">
        <ReportHeader />
      </div>
      <div className="comp-item">
        <h1>사건 개요</h1>
        <br />
        <h5>직장 내 괴롭힘 사건에 대한 개요입니다.</h5>
        <h5>괴롭힘 유형별 건수와 사건을 요약하여 나타냅니다.</h5>
        <br />
        <label>
          피해기간 {startDate}~{endDate}
          {"  "}
        </label>
        <br></br>
        <label>행위자</label>
        <br></br>
        {attackers.join(", ")}
        <br />
        <br />
        <h3>괴롭힘 유형별 건수</h3>
        전체 증거물들에 대한 괴롭힘 유형별 건수입니다.
        <br />
        <br />
        괴롭힘 증거 자료 {evidence.length}건 중<br />
        <br />
        <br />

        {/* {bullying.join(", ")}
        <br></br>
        {Object.keys(tmp).map((c) => c + ", ")}
        <br></br>
        {Object.entries(tmp).map(([key, value]) => key + ":" + value + "  ")} */}
        <div style={{width:"80%"}}>
        <Table style={{ tableLayout: "fixed", wordBreak: "break-all",wordWrap:"break-word" }}>
          <colgroup>
            {Object.entries(tmp).map(([key, value]) => (
              <col style={{ width: value + "%", backgroundColor:barGraph[Math.floor(Math.random() * barGraph.length)] }} />
            ))}
          </colgroup>
          <TableHead style={{ height: 10 }}>
            {Object.entries(tmp).map(([key, value]) => (
              <TableCell align="center">
                <Typography variant="body1" style={{ fontWeight: "bolder" }}>
                  {key}
                </Typography>
                <Typography variant="subtitle2">{value}건</Typography>
              </TableCell>
            ))}
          </TableHead>
        </Table>
        </div>
        <br></br>
        <h3>괴롭힘 사건 요약</h3>
        괴롭힘 증거자료를 시간순으로 나타낸 결과입니다.
        <br />
        <br />
        <Timeline className={classes.timeline} align="alternate">
          {evidence.map((c) => (
            <OverviewTimeline
              date={c.date}
              filename={c.filename}
              attacker={c.attacker}
              type={c.type}
            />
          ))}

          {/* {evidence.map((c)=>(
                console.log(c)
            ))} */}
        </Timeline>
        <h1>요구사항</h1>
        <h5>신고기관에 바라는 요구 사항을 선택하세요.</h5>
        <br />
        <button>수정</button>
        <button>확인</button>
      </div>
    </div>
  );
};

export default Overview;