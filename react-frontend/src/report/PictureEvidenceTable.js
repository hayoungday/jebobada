import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {Link} from 'react-router-dom';
import axios from 'axios';
// import CustomerDelete from './CustomerDelete';

const PictureEvidenceTable =(props)=>{

    const edited=()=>{
        if (props.manipul === "false" || props.edited === "false"){
            return "X"
        } else{
            return "O"
        }
    }


    return (
        <TableRow>
            <TableCell style={{ textAlign: "center" }}><span className="yoon_recordEvidence-table-body-text">{props.index}</span></TableCell>
            <TableCell style={{ textAlign: "center" }}><span className="yoon_recordEvidence-table-body-text">{props.name}</span></TableCell>
            <TableCell style={{ textAlign: "center" }}><span className="yoon_recordEvidence-table-body-text">{edited()}</span></TableCell>
            <TableCell style={{ textAlign: "center" }}><span className="yoon_recordEvidence-table-body-text">{props.filehash}</span></TableCell>
        </TableRow>
    )
}

export default PictureEvidenceTable;