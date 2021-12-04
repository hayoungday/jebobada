import React, {useEffect, useState} from 'react';
import {TableRow, TableCell, Table, TableHead, TableBody} from '@material-ui/core';
import {Link} from 'react-router-dom';
import axios from 'axios';
import ReportHeader from './ReportHeader';
import RecordEvidenceTable from './RecordEvidenceTable';
import RecordEvidenceDetail from './RecordEvidenceDetail';

const RecordEvidence = (props) => {
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
          type : "record",
      }
      axios.post('/getallevidence',body).then((res)=>{
        res.data.map((c)=>{
          if (c.manipulated === "false" || c.edited === "false"){
            Setevidence(oldArray => [...oldArray, c]);
          }else{
            console.log("pushpushbabay")
          }
        })
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
          <h1>녹음 증거 자료 목록</h1> 
            녹음 증거 자료 목록입니다.<p/>해시값 비교와 편집(위변조)여부 분석을 통해 증거 자료의 악의적 편집 여부를 알 수 있습니다.

            <h3> 악의적 편집 여부 분석 결과 </h3>
            아래 목록의 녹음 증거 자료들은 편집 및 조작 검증 프로그램에서<p/>'조작되지 않음' 판정을 받았습니다.
              <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ textAlign: "center" }}>No</TableCell>
                  <TableCell style={{ textAlign: "center" }}>이름</TableCell>
                  <TableCell style={{ textAlign: "center" }}>*편집 및 조작</TableCell>
                  <TableCell style={{ textAlign: "center" }}>해시값</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              
                  {evidence.map((c, i) => {
                    return (
                      <RecordEvidenceTable
                        index = {no+i}
                        name={c.filename}
                        type={c.filetype}
                        filehash={c.file_hash_data}
                      />
                    );
                  })}
              </TableBody>
            </Table>

            *편집 : 해당 녹음 파일이 편집 프로그램으로 생성한 파일인지 알려줍니다.<p/>
            *조작 : 음성 파일에 편집된 흔적이 있는지에 대한 정보입니다.
            <p/>
            <br/><br/>

            <h3>판단 근거</h3>
            ‘JeBoBADA'에서는 다음을 검증하여 이미지 파일의 편집과 조작 여부를 판단합니다.<br/>
            (1) 메타데이터를 분석하여 포토샵(Adobe Photoshop) 프로그램이 사용되었는지 여부를 검증할 수 있습니다.<br/>
            (2) 대화 입력 칸의 이모티콘 버튼, # 버튼의 거리 비율 비교를 통해 조작 어플로 생성된 캡쳐 이미지인지를 판단할 수 있습니다.<br/>
              - 조작 어플의 경우 이모티콘 버튼과 # 버튼의 거리가 카카오톡 어플에 비해 더 멉니다.<br/>
              (비율이 3.7과 4.1 사이에 있으면 편집되지 않은 이미지로 간주합니다.)<br/>
            (3) 대화박스가 어긋나지 않고 정상적으로 정렬되었는지를 검증하여 이미지 편집 프로그램을 사용하여 대화를 재구성하지 않았는지 검증합니다. <br/>
                - 하얀색 대화 박스들이 같은 가로축에 위치하는지를 검증합니다.<br/>
            <br/><br/><br/>

            {evidence.map((c,index)=>{
              return(
                <RecordEvidenceDetail
                  filename = {c.filename}
                  meta = {c.metadata}
                  idx = {index}
                />
              )
            })}
        </div>
      </div>
    )
}

export default RecordEvidence;