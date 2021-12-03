import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {Link} from 'react-router-dom';
import axios from 'axios';
// import CustomerDelete from './CustomerDelete';

const MainBullyingDetail =(props)=>{

    return (
        <div>
            {props.idx+1}) {props.date}에 {props.attacker.join(", ")}에게 {props.location}에서 {props.bullying.join(", ")}을 당했습니다.<p/>
            {props.desc}
            <br/><br/>
        </div>
        
    )
}

export default MainBullyingDetail;