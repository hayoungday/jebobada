import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
let image_src = "../../.././static/react/artifact_icons/";
export default function ViewArtifact(props) {
  //console.log(props.data[0].data);

  const header_Typo = {
    color: "#4B64D4",
    fontFamily: "NanumSquare-Regular",
  };

  const desc_Typo = {
    fontFamily: "NanumSquare",
    color: "#4B64D4",
    fontWeight: "bolder",
  };

  return (
    <div className="table_style_report">
      <Table
        style={{
          tableLayout: "fixed",
          wordBreak: "break-all",
          wordWrap: "break-word",
        }}
      >
        <colgroup>
          
          <col style={{ width: "10%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "40%" }} />
          <col style={{ width: "35%" }} />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6"></Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" style={header_Typo}>
                설명 / 시간
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" style={header_Typo}>
                작업명
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" style={header_Typo}>
                파일 경로
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          {props.data.data.map((c, i) => {
            return c.isChecked == "true" ? (
              <TableRow>
                <TableCell>
                  <img
                    style={{ maxHeight: "30px", maxWidth: "30px" }}
                    src={image_src + c.Icon + ".png"}
                  ></img>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" style={desc_Typo}>
                    {c.Desc}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {c.Timestamp.replace("T", " ")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <div style={{ whiteSpace: "normal" }}>
                    <Typography variant="subtitle1">{c.Name}</Typography>
                  </div>
                </TableCell>
                <TableCell>
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
};