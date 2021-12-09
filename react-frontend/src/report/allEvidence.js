import React, {useEffect, useState} from 'react';
import {TableRow, TableCell, Table, TableHead, TableBody} from '@material-ui/core';
import {Link} from 'react-router-dom';
import axios from 'axios';
import AllEvidenceTable from './allEvidenceTable';
import './reportHeader.css'
import ReportHeader from './ReportHeader';
import Stack from "@mui/material/Stack";

const AllEvidence = (props) => {

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
        <div className="flex-container">
          <div className="nav-item">
            <ReportHeader case_id={props.location.state.case_id}/>
          </div>
          <div className="yoon_overview-container">
          <Stack direction="row" alignItems="center" spacing={6}>
            <span className="yoon_overview-title">전체 자료 목록</span>
            <br />
            <span className="yoon_overview-tilte-desc">
            전체 증거 자료 목록입니다.
              <br />
              해시값 비교를 통해 증거 자료의 위변조 여부를 알 수 있습니다.
            </span>
          </Stack>
          <br /><br />

            <Table>
            <TableHead className="yoon_recordEvidence-table-header">
              <TableRow>
                <TableCell style={{ textAlign: "center" }}>
                  <span className="yoon_recordEvidence-table-header-text">No</span>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <span className="yoon_recordEvidence-table-header-text">이름</span>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <span className="yoon_recordEvidence-table-header-text">분류</span>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}><span className="yoon_recordEvidence-table-header-text">*해시값</span></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            
                {evidence.map((c, i) => {
                  return (
                    <AllEvidenceTable
                      index = {no+i}
                      name={c.filename}
                      type={c.filetype}
                      filehash={c.file_hash_data}
                    />
                  );
                })}
            </TableBody>
          </Table>
          <br/>
          <span className="allevdi_contents_desc">
            *해시값 : 디지털 증거의 원본성을 입증하기 위해 파일 특성을 축약한 암호같은 수치
          </span>
      </div>
    </div>
    )
}

export default AllEvidence;