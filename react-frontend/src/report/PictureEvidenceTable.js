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
            <TableCell style={{ textAlign: "center" }}>{props.index}</TableCell>
            <TableCell style={{ textAlign: "center" }}>{props.name}</TableCell>
            <TableCell style={{ textAlign: "center" }}>{edited()}</TableCell>
            <TableCell style={{ textAlign: "center" }}>{props.type}</TableCell>
            <TableCell style={{ textAlign: "center" }}>{props.filehash}</TableCell>
        </TableRow>
    )
}

export default PictureEvidenceTable;