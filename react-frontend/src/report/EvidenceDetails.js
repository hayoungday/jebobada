import React, {useEffect, useState} from 'react';
import {TableRow, TableCell, Table, TableHead, TableBody} from '@material-ui/core';
import {Link} from 'react-router-dom';
import axios from 'axios';
import AllEvidenceTable from './allEvidenceTable';
import './reportHeader.css'
import ReportHeader from './ReportHeader';
import EvidenceDetailsPostView from './EvidenceDetailsPostView';



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


    return(
        <div className="flex-container">
          <div className="nav-item">
            <ReportHeader case_id={props.location.state.case_id}/>
          </div>
          <div className="comp-item">
          
          {evidence.map((c,index)=>              
                <EvidenceDetailsPostView
                  filename = {c.filename}
                  meta = {c.metadata}
                  filetype = {c.fileType}
                  // filesize = {c.meta.filesize}
                  // imageCtime = {c.meta.imageCtime}
                  // gpsPosition = {c.meta.gpsPosition}
                  // deviceModel = {c.meta.deviceModel}
                  // software = {c.meta.software}
                  // audioCtime = {c.meta.audioCtime}
                  // title = {c.meta.title}
                  // duration = {c.meta.duration}

                  date = {c.date}
                  location = {c.location}
                  attacker = {c.attacker}
                  filetype = {c.filetype}
                  desc = {c.desc}
                  filehash = {c.hashed_filename}
                  idx = {index}
                  _id = {c._id}
                  data = {c}
                  bulltype = {c.type}
                />
              )}

            {evidence.map((c)=>(  
                console.log(c)
              ))}
          </div>
        </div>
    )
}

export default EvidenceDetails;