import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {Link} from 'react-router-dom';
import axios from 'axios';
// import CustomerDelete from './CustomerDelete';

const PictureEvidenceDetail =(props)=>{
     Object.keys(props.fullmeta).map(function (key, value) {
          console.log(key + ":" + props.fullmeta[key] + "-" + value);
        });
        let keys = Object.keys(props.fullmeta);
        console.log("keys : " + keys);
        let values = Object.values(props.fullmeta);
        console.log("values : " + values);
    return (
        <div>
            <span className="reason_evidence_name">{props.idx+1}) {props.filename}</span>

            <br/>
            <span className="reason_contents_desc">
               ① 다음의 파일 정보(메타 데이터) 조합이 분석되어 편집되지 않은 원본인 것으로 추정됩니다.
            </span>
            <br/>
            <br/>
            
            <div className="yoon_recordEvidence-res-table">
        {Object.keys(props.fullmeta).map(function (key, value) {
          if (value > keys.length / 3) {
            return null;
          } else {
            return (
              <TableRow>
                <TableCell
                  style={{ textAlign: "center" }}
                  className="yoon_recordEvidence-res-table-header"
                >
                  <span className="yoon_recordEvidence-res-table-header-text">
                    {keys[value * 3]}
                  </span>
                </TableCell>
                <TableCell style={{ textAlign: "center"}} className="yoon_recordEvidence-res-table-body">
                  <span className="yoon_recordEvidence-res-table-body-text">
                    {props.fullmeta[keys[value * 3]]}
                  </span>
                </TableCell>

                <TableCell
                  style={{ textAlign: "center" }}
                  className="yoon_recordEvidence-res-table-header"
                >
                  <span className="yoon_recordEvidence-res-table-header-text">
                    {keys[value * 3 + 1]}
                  </span>
                </TableCell>
                <TableCell style={{ textAlign: "center" }} className="yoon_recordEvidence-res-table-body">
                  <span className="yoon_recordEvidence-res-table-body-text">
                    {props.fullmeta[keys[value * 3 + 1]]}
                  </span>
                </TableCell>

                <TableCell
                  style={{ textAlign: "center" }}
                  className="yoon_recordEvidence-res-table-header"
                >
                  <span className="yoon_recordEvidence-res-table-header-text">
                    {keys[value * 3+2]}
                  </span>
                </TableCell>
                <TableCell style={{ textAlign: "center" }} className="yoon_recordEvidence-res-table-body">
                  <span className="yoon_recordEvidence-res-table-body-text">
                    {props.fullmeta[keys[value * 3+2]]}
                  </span>
                </TableCell>
              </TableRow>
            );
          }
        })}
      </div>
           <br/><br/>
           <span className="reason_contents_desc">
               ② 조작 어플로 생성된 캡처 이미지와 해당 이미지 비율을 비교한 결과 정상 범주인 3.7과 4.1 사이의 “{props.ratio}”라는 수치가 매겨졌습니다. 따라서 조작되지 않은 이미지로 추정됩니다.<br/>
               ③ 대화박스가 일렬로 정렬되어 있는지 확인한 결과, 정상적으로 정렬되어 있는 것을 확인하였습니다. 따라서 조작되지 않은 이미지로 추정됩니다. 
            </span>
            <br/><br/><br/>
        </div>
        
    )
}

export default PictureEvidenceDetail;