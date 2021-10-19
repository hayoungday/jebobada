import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {Link} from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
// import CustomerDelete from './CustomerDelete';

class Evidence extends React.Component {
    callApi = async() => {
        const response = await fetch('/getuser')
        const body = await response.json();
        console.log(body)
        return body
    }
    render() {
        return (            
            <TableRow>
                <TableCell style={{ textAlign: "center" }}>{this.props.id}</TableCell>

                <TableCell style={{ textAlign: "center" }}>
                    <Link to={'/PostView/'+this.props.casenum+'/'+this.props.idx+'/'+this.props.keyword}>{this.props.name}</Link>
                </TableCell>

                <TableCell style={{ textAlign: "center" }}>{this.props.uploaded_time}</TableCell>

                <TableCell style={{ textAlign: "center" }}>{this.props.type}</TableCell>

                <TableCell style={{ textAlign: "center" }}>
                    {this.props.state==="변환완료"? <div>변환완료</div>:<div><CircularProgress variant="indeterminate" value="변환중"/></div>}                                    
                </TableCell>
            </TableRow>
        )
    }
}

export default Evidence;