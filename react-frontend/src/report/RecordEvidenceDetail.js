import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {Link} from 'react-router-dom';
import axios from 'axios';
// import CustomerDelete from './CustomerDelete';

const RecordEvidenceDetail =(props)=>{

    return (
        <div>
            <h2>{props.idx+1}) {props.filename}</h2>
            <br/>
            ① 다음의 파일 정보(메타 데이터) 조합이 분석되어 편집되지 않은 원본인 것으로 추정됩니다.
          <br/>
            <TableRow/>
            <TableRow>
                <TableCell style={{ textAlign: "center" }}>File Name</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
                <TableCell style={{ textAlign: "center" }}>Directory</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
           </TableRow>
           <TableRow>
                <TableCell style={{ textAlign: "center" }}>File Name</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
                <TableCell style={{ textAlign: "center" }}>Directory</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
           </TableRow>
           <TableRow>
                <TableCell style={{ textAlign: "center" }}>File Name</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
                <TableCell style={{ textAlign: "center" }}>Directory</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
           </TableRow>
           <TableRow>
                <TableCell style={{ textAlign: "center" }}>File Name</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
                <TableCell style={{ textAlign: "center" }}>Directory</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
           </TableRow>
           <TableRow>
                <TableCell style={{ textAlign: "center" }}>File Name</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
                <TableCell style={{ textAlign: "center" }}>Directory</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
           </TableRow>
           <TableRow>
                <TableCell style={{ textAlign: "center" }}>File Name</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
                <TableCell style={{ textAlign: "center" }}>Directory</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
           </TableRow>
           <TableRow>
                <TableCell style={{ textAlign: "center" }}>File Name</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
                <TableCell style={{ textAlign: "center" }}>Directory</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
           </TableRow>
           <TableRow>
                <TableCell style={{ textAlign: "center" }}>File Name</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
                <TableCell style={{ textAlign: "center" }}>Directory</TableCell>
                <TableCell style={{ textAlign: "center" }}>{props.filename}</TableCell>
           </TableRow>
           <br/><br/>
           ② 인공지능 모델 CNN(STFT)을 사용하여 분석한 결과, 해당 녹음 파일은 조작되지 않은 것으로 추정됩니다.
           <br/><br/><br/>
        </div>
        
    )
}

export default RecordEvidenceDetail;