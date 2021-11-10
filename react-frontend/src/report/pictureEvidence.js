import React, {useEffect, useState} from 'react';
import {TableRow, TableCell, Table, TableHead, TableBody} from '@material-ui/core';
import {Link} from 'react-router-dom';
import axios from 'axios';
import './reportHeader.css'
import ReportHeader from './ReportHeader'
import PictureEvidenceTable from './PictureEvidenceTable'


const PictureEvidence = () => {

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
          type : "picture",
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
          <ReportHeader/>
        </div>
        <div className="comp-item">
          <h1>사진 증거 자료 목록</h1> 
            사진 증거 자료 목록입니다.<p/>해시값 비교와 편집(조작)여부 분석을 통해 증거 자료의 조작 여부를 알 수 있습니다.

            <h3> 조작 여부 분석 결과 </h3>
            해시값 비교와 편집(조작) 여부 분석을 통해<p/>'조작되지 않음' 판정을 받았습니다.
              <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ textAlign: "center" }}>No</TableCell>
                  <TableCell style={{ textAlign: "center" }}>이름</TableCell>
                  <TableCell style={{ textAlign: "center" }}>조작</TableCell>
                  <TableCell style={{ textAlign: "center" }}>분류</TableCell>
                  <TableCell style={{ textAlign: "center" }}>*해시값</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              
                  {evidence.map((c, i) => {
                    return (
                      <PictureEvidenceTable
                        index = {no+i}
                        name={c.filename}
                        type={c.filetype}
                        filehash={c.file_hash_data}
                      />
                    );
                  })}
              </TableBody>
            </Table>
            *해시값: 디지털 증거의 원본성을 입증하기 위해 파일 특성을 축약한 암호같은 수치
        </div>
      </div>
    )
}

export default PictureEvidence;