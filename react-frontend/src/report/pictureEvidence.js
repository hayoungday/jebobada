import React, {useEffect, useState} from 'react';
import {TableRow, TableCell, Table, TableHead, TableBody} from '@material-ui/core';
import {Link} from 'react-router-dom';
import axios from 'axios';
import './reportHeader.css'
import ReportHeader from './ReportHeader'
import PictureEvidenceTable from './PictureEvidenceTable'
import PictureEvidenceDetail from './PictureEvidenceDetail';
import Stack from "@mui/material/Stack";


const PictureEvidence = (props) => {

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
        // Setevidence(res.data)
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
        <div className="yoon_overview-container">
          <Stack direction="row" alignItems="center" spacing={6}>
            <span className="yoon_overview-title">이미지 증거 자료 목록</span>
            <br/>
            <span className="yoon_overview-tilte-desc">
              이미지 증거 자료 목록입니다.<p/>
              해시값 비교와 편집(조작)여부 분석을 통해<p/>
              증거 자료의 조작 여부를 알 수 있습니다.
            </span>
          </Stack>

          <br/>
          
          <sapn className="yoon_overview-subtitle">조작 여부 분석 결과</sapn>
            <br/><br/>
            <span className="yoon_overview-subtitle-desc-center">
            아래 목록의 녹음 증거 자료들은 편집 및 조작 검증 프로그램에서
            </span> <br/>
            <span className="yoon_overview-subtitle-desc-center">
              <span className="red">'조작되지 않음'</span> 판정을 받았습니다.
            </span> 
            <br/><br/>

            
            <Table>
            <TableHead className="yoon_recordEvidence-table-header">
              <TableRow>
                <TableCell style={{ textAlign: "center" }}><span className="yoon_recordEvidence-table-header-text">No</span></TableCell>
                <TableCell style={{ textAlign: "center" }}><span className="yoon_recordEvidence-table-header-text">이름</span></TableCell>
                <TableCell style={{ textAlign: "center" }}><span className="yoon_recordEvidence-table-header-text">*편집 및 조작</span></TableCell>
                <TableCell style={{ textAlign: "center" }}><span className="yoon_recordEvidence-table-header-text">해시값</span></TableCell>
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
                    manipul = {c.manipulated}
                    edited = {c.edited}
                  />
                );
              })}
            </TableBody>
          </Table>

          <span className="term_contents_desc">
          <br/>
            *편집 : 해당 녹음 파일이 편집 프로그램으로 생성한 파일인지 알려줍니다.<p/>
            *조작 : 음성 파일에 편집된 흔적이 있는지에 대한 정보입니다.
          </span>

          <br/><br/><br/>
          <sapn className="yoon_overview-subtitle">판단 근거</sapn>
          <br/>
          <span className="reason_contents_desc">
              <span className="bold">
              ‘JeBoBADA'에서는 다음을 검증하여 녹음 파일의 편집과 조작 여부를 판단합니다.<br/>
              </span>
              
              (1) 녹음 파일의 생성 시각보다 수정 시각이 최근에 가까울 경우 녹음 파일 내용이 수정되었다고 판단할 수 있습니다.<br/>

              (2) 메타데이터를 분석하여 편집 프로그램 중 하나가 사용되었는지 여부를 검증할 수 있습니다. <br/>

              (3) 인공지능을 사용해 음성 파일이 짜깁기 되었는지 판단합니다.<br/>
                  - 짜깁기 된 음성 파일과 정상 음성 파일을 사용해 CNN(STFT)라는 인공지능(머신러닝) 모델을 훈련시켜 사용합니다. (정확도 : n %)<br/>
          </span>
          <br/><br/><br/>

          {evidence.map((c,index)=>{
            return(
              <PictureEvidenceDetail
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

export default PictureEvidence;