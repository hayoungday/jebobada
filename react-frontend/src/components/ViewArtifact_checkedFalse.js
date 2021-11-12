import React, { Component, useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Tooltip } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import Typography from "@mui/material/Typography";

import Checkbox from "@mui/material/Checkbox";
const label = { inputProps: { "aria-label": "Checkbox demo" } };
let image_src="./static/react/artifact_icons/"

export default function ViewArtifact_checkedFalse(props) {
  const [checkedInputs, setCheckInputs] = useState([]);
  const changeHandler = (checked, id) => {
    if (checked) {
      setCheckInputs([...checkedInputs, id]);
      props.data[id].isChecked = "true";
      console.log(id);
      props.getData(props.data);
    } else {
      setCheckInputs(checkedInputs.filter((el) => el !== id));
      props.data[id].isChecked = "false";
      console.log(id);
      props.getData(props.data);
    }
  };

  // console.log(props.startTime);
  // console.log(props.endTime);
  // console.log(props.isFilter)
  // console.log(props.work_startTime)
  // console.log(props.work_endTime)
  
  let filteredData;
  if(props.isDetail==false){
    console.log(props.isDetail)
    filteredData = props.data.filter(
      (res) => res.Timestamp >= props.startTime && res.Timestamp <= props.endTime &&res.Name.includes(props.keyword)&&(res.Desc=="컴퓨터 ON"||res.Desc=="컴퓨터 OFF"||res.Desc=="인터넷 검색"||res.Desc=="웹사이트 방문"||res.Desc=="문서 삭제"||res.Desc=="문서 열람")
    );
  }
  else{
    filteredData = props.data.filter(
      (res) => res.Timestamp >= props.startTime && res.Timestamp <= props.endTime &&res.Name.includes(props.keyword)
    );    
  }  

  return (
    <div style={{ transition: "all.5s ease"}}>
      <Table style={{ transition: "all.5s ease", tableLayout:"fixed",wordBreak:"break-all",wordWrap:"break-word"}}>
        <colgroup>
          <col style={{ width: "10%" }} />
          <col style={{ width: "5%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "30%" }} />
          {props.isDetail==true?<col style={{ width: "25%" }}/>:null}
          
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>
              <Typography variant="h6"></Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">설명</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">시간</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">작업명</Typography>
            </TableCell>
            {props.isDetail==true?<TableCell>
              <Typography variant="h6">경로</Typography>
            </TableCell>:null}
            
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData ? (
            filteredData.map((c) => {
              return (
                <TableRow
                  style={
                    c.Labeling.includes(props.type) && props.type != "초과근무"
                      ? {
                          backgroundColor: "#D1E6F9",
                          transition: "all.5s ease",
                        }
                      : props.type == "초과근무" &&
                        c.Timestamp.substring(11, 19) >= props.work_endTime
                      ? {
                          backgroundColor: "#D1E6F9",
                          transition: "all.5s ease",
                        }
                      : { transition: "all.5s ease" }
                  }
                >
                  <TableCell>
                    {c.isChecked == "false" ? (
                      <Checkbox
                        {...label}
                        defaultChecked={false}
                        onChange={(e) => {
                          changeHandler(e.currentTarget.checked, c.index);
                        }}
                        checked={false}
                      />
                    ) : (
                      <Checkbox
                        {...label}
                        onChange={(e) => {
                          changeHandler(e.currentTarget.checked, c.index);
                        }}
                        checked={checkedInputs.includes(c.index) ? true : false}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <img
                      style={{ maxHeight: "30px", maxWidth: "30px" }}
                      src={image_src + c.Icon + ".png"}
                    ></img>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">{c.Desc}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">
                      {c.Timestamp.replace("T", " ")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <div style={{ whiteSpace: "normal"}}>
                    <Typography variant="subtitle1">{c.Name}</Typography></div>
                  </TableCell>
                  {props.isDetail==true?<TableCell>
                    <Typography variant="subtitle1">{c.path}</Typography>
                  </TableCell>:null}
                </TableRow>
              );
            })
          ) : (
            <CircularProgress variant="indeterminate" />
          )}
        </TableBody>
      </Table>
    </div>
  );
}
