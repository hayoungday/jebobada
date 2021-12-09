import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {Link} from 'react-router-dom';
import axios from 'axios';
// import CustomerDelete from './CustomerDelete';

const RecordEvidenceDetail =(props)=>{
     console.log(props)
    return (
        <div>
          <sapn className="reason_evidence_name">{props.idx+1}) {props.filename}</sapn>
            
          <br/>
          <span className="reason_contents_desc">
               ① 다음의 파일 정보(메타 데이터) 조합이 분석되어 편집되지 않은 원본인 것으로 추정됩니다.
          </span>
          <br/>
            <TableRow/>
            <TableRow>
                <TableCell style={{ textAlign: "center" }}>File Name</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
                <TableCell style={{ textAlign: "center" }}>Directory</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
           </TableRow>
           <TableRow>
                <TableCell style={{ textAlign: "center" }}>Warning</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
                <TableCell style={{ textAlign: "center" }}>File Size</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
           </TableRow>
           <TableRow>
                <TableCell style={{ textAlign: "center" }}>File Modification Date/Time</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
                <TableCell style={{ textAlign: "center" }}>File Access Date/Time</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
           </TableRow>
           <TableRow>
                <TableCell style={{ textAlign: "center" }}>File Creation Date/Time</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
                <TableCell style={{ textAlign: "center" }}>Create Date</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
           </TableRow>
           <TableRow>
                <TableCell style={{ textAlign: "center" }}>Modify Date</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
                <TableCell style={{ textAlign: "center" }}>Time Scale</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
           </TableRow>
           <TableRow>
                <TableCell style={{ textAlign: "center" }}>Duration</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
                <TableCell style={{ textAlign: "center" }}>Media Time Scale</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
           </TableRow>
           <TableRow>
                <TableCell style={{ textAlign: "center" }}>Media Duration</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
                <TableCell style={{ textAlign: "center" }}>Handler Type</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
           </TableRow>
           <TableRow>
                <TableCell style={{ textAlign: "center" }}>Handler Description</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
                <TableCell style={{ textAlign: "center" }}>Audio Format</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
           </TableRow>
           <br/><br/>
           <span className="reason_contents_desc">
               ② 인공지능 모델 CNN(STFT)을 사용하여 분석한 결과, 해당 녹음 파일은 조작되지 않은 것으로 추정됩니다.
           </span>
           <br/><br/><br/>
        </div>
        
    )
}

export default RecordEvidenceDetail;