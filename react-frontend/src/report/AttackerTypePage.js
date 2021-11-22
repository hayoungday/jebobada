import React, {useEffect, useState} from 'react';
import {TableRow, TableCell, Table, TableHead, TableBody} from '@material-ui/core';
import {Link} from 'react-router-dom';
import axios from 'axios';
import AllEvidenceTable from './allEvidenceTable';
import './reportHeader.css'
import ReportHeader from './ReportHeader';

const AttackerTypePage = (props) => {

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
            <ReportHeader/>
          </div>
          <div className="comp-item">
            <h1>행위자별 괴롭힘 행위</h1> 
              <p>행위자별 괴롭힘 피해 행위를 통해 특정 행위자에게서 어떠한 괴롭힘을 당했는지 알 수 있습니다.</p>
                <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ textAlign: "center" }}>No</TableCell>
                    <TableCell style={{ textAlign: "center" }}>이름</TableCell>
                    <TableCell style={{ textAlign: "center" }}>분류</TableCell>
                    <TableCell style={{ textAlign: "center" }}>*해시값</TableCell>
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
          </div>
        </div>
    )
}

export default AttackerTypePage;