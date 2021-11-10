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
  return (
    <div style={{ transition: "all.5s ease" }}>
      <Table style={{ tableLayout: "fixed", wordBreak: "break-all" }}>
        <colgroup>
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "40%" }} />
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
                <TableCell>icon</TableCell>
                <TableCell>
                  <Typography variant="subtitle1">{c.Desc}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1">
                    {c.Timestamp.replace("T", " ")}
                  </Typography>
                </TableCell>
                <TableCell style={{ textOverflow: "ellipsis" }}>
                  <Typography variant="subtitle1">{c.Name}</Typography>
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
