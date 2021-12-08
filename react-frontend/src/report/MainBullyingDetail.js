import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {Link} from 'react-router-dom';
import axios from 'axios';
// import CustomerDelete from './CustomerDelete';

const MainBullyingDetail =(props)=>{

    return (
        <span className="mainbullying_contents">
            {props.idx+1}) 
            <span className="highlight">{props.date}</span>에 <span className="highlight">{props.attacker.join(", ")}</span>에게 
            <span className="highlight">{props.location}</span>에서 
            <span className="highlight">{props.bullying.join(", ")}</span>을 당했습니다.<p/>
            
            <div className="mainbullying_desc">
                {props.desc}
            </div>
            <br/>
        </span>
        
    )
}

export default MainBullyingDetail;