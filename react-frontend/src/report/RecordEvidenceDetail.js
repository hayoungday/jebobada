import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { Link } from "react-router-dom";
import axios from "axios";
import { Tab } from "@material-ui/core";
// import CustomerDelete from './CustomerDelete';

const RecordEvidenceDetail = (props) => {
  console.log(props);

  Object.keys(props.fullmeta).map(function (key, value) {
    console.log(key + ":" + props.fullmeta[key] + "-" + value);
  });
  let keys = Object.keys(props.fullmeta);
  console.log("keys : " + keys);
  let values = Object.values(props.fullmeta);
  console.log("values : " + values);

  return (
    <div>
      <sapn className="reason_evidence_name">
        {props.idx + 1}) {props.filename}
      </sapn>

      <br />
      <span className="reason_contents_desc">
        ① 다음의 파일 정보(메타 데이터) 조합이 분석되어 편집되지 않은 원본인
        것으로 추정됩니다.
      </span>
      <br />
      <br />
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
                <TableCell style={{ textAlign: "center" }} className="yoon_recordEvidence-res-table-body">
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

      <br />
      <br />
      <span className="reason_contents_desc">
        ② 인공지능 모델 CNN(STFT)을 사용하여 분석한 결과, 해당 녹음 파일은
        조작되지 않은 것으로 추정됩니다.
      </span>
      <br />
      <br />
      <br />
    </div>
  );
};

export default RecordEvidenceDetail;
