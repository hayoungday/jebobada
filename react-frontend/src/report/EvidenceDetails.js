import React, {useEffect, useState} from 'react';
import {TableRow, TableCell, Table, TableHead, TableBody} from '@material-ui/core';
import {Link} from 'react-router-dom';
import axios from 'axios';
import AllEvidenceTable from './allEvidenceTable';
import './reportHeader.css'
import './EvidenceDetails.css'
import ReportHeader from './ReportHeader';
import EvidenceDetailsPostView from './EvidenceDetailsPostView';
import Stack from "@mui/material/Stack";
import Header from '../components/Header';




const EvidenceDetails = (props) => {

    const [evidence, Setevidence] = useState([])
    const [no, Setno] = useState(1)
    const [filetype, setFiletype] = useState("")
    const [filesize, setFilesize] = useState("")
    const [imageCtime, setImageCtime] = useState("")
    const [gpsPosition, setgpsPosition] = useState("")
    const [deviceModel, setDeviceModel] = useState("")
    const [software, setSoftware] = useState("")
    const [audioCtime, setAudioCtime] = useState("")
    const [title, setTitle] = useState("")
    const [duration, setDuration] = useState("")

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


    return (
      <div>
        <Header />
      <div className="flex-container">
        <div className="nav-item">
          <ReportHeader case_id={props.location.state.case_id} />
        </div>
        <div className="yoon_evidenceDetail-container">
          <Stack direction="row" alignItems="center" spacing={6}>
            <span className="yoon_evidenceDetail-title">증거 자료</span>
            <span className="yoon_overview-tilte-desc">
              증거 자료에 대한 상세 정보입니다
              <br />각 증거 자료에 대한 상세 설명을 확인할 수 있습니다.
            </span>
          </Stack>
          <br/><br/>
          {evidence.map((c, index) => (
            <EvidenceDetailsPostView
              filename={c.filename}
              meta={c.metadata}
              filetype={c.fileType}
              date={c.date}
              location={c.location}
              attacker={c.attacker}
              filetype={c.filetype}
              desc={c.desc}
              filehash={c.hashed_filename}
              idx={index}
              _id={c._id}
              data={c}
              bulltype={c.type}
            />
          ))}

          {evidence.map((c) => console.log(c))}
        </div>
      </div>
      </div>
    );
}

export default EvidenceDetails;