import React, { Component, useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Tooltip } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import Typography from '@mui/material/Typography';

import Checkbox from "@mui/material/Checkbox";
const label = { inputProps: { "aria-label": "Checkbox demo" } };
let image_src="./static/react/artifact_icons/"
export default function ViewArtifact_checkedTrue(props) {
  const [checkedInputs, setCheckInputs] = useState([]);
  const changeHandler = (checked, id) => {
    if (checked) {
      setCheckInputs([...checkedInputs, id]);
      props.data[id].isChecked = "true";

      props.getData(props.data);
    } else {
      setCheckInputs(checkedInputs.filter((el) => el !== id));
      props.data[id].isChecked = "false";

      props.getData(props.data);
    }
  };
  //   console.log(props.type);
  const header_Typo={
    color:"#4B64D4",
    fontFamily: "NanumSquare-Regular"
  }

  const desc_Typo={
    fontFamily:"NanumSquare",
    color:"#4B64D4",
    fontWeight:"bolder"
  }

  return (
    <div style={{ transition: "all.5s ease" }}>
      <Table style={{ tableLayout: "fixed", wordBreak: "break-all",wordWrap:"break-word" }}>
        <colgroup>
          <col style={{ width: "5%" }} />
          <col style={{ width: "5%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "40%" }}/>
          <col style={{ width: "35%" }}/>
          
        </colgroup>
        <TableHead>
        <TableRow>
            <TableCell></TableCell>
            <TableCell >
              <Typography variant="h6"></Typography>
            </TableCell>
            <TableCell >
              <Typography variant="h6" style={header_Typo}>설명 / 시간</Typography>
            </TableCell>
            <TableCell >
              <Typography variant="h6" style={header_Typo}>작업명</Typography>
            </TableCell >
           <TableCell>
              <Typography variant="h6" style={header_Typo}>파일 경로</Typography>
            </TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((c, i) => {
            return c.isChecked == "true" ? (
              <TableRow>
                <TableCell> 
                  {c.isChecked == "true" ? (
                    <Checkbox
                      {...label}
                      defaultChecked={true}
                      onChange={(e) => {
                        changeHandler(e.currentTarget.checked, i);
                      }}
                      checked={true}
                    />
                  ) : (
                    <Checkbox
                      {...label}
                      onChange={(e) => {
                        changeHandler(e.currentTarget.checked, i);
                      }}
                      checked={checkedInputs.includes(i) ? true : false}
                    />
                  )}
                </TableCell>
                <TableCell><img
                      style={{ maxHeight: "30px", maxWidth: "30px" }}
                      src={image_src + c.Icon + ".png"}
                    ></img></TableCell>
                <TableCell>
                <Typography variant="h6" style={desc_Typo}>{c.Desc}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {c.Timestamp.replace("T", " ")}
                    </Typography>
                </TableCell>
                <TableCell>
                <div style={{ whiteSpace: "normal"}}>
                    <Typography variant="subtitle1">{c.Name}</Typography></div>
                </TableCell>
                <TableCell >
                <Typography variant="subtitle1">{c.path}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              <div></div>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
