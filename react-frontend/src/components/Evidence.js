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
                <TableCell>{this.props.id}</TableCell>
                {/* <TableCell><img src={this.props.image} alt="profile"/></TableCell> */}
                <TableCell>{this.props.name}</TableCell>
                <TableCell>{this.props.uploaded_time}</TableCell>
                <TableCell>
                    {this.props.state==="변환완료"? <div>변환완료</div>:<div><CircularProgress variant="indeterminate" value="변환중"/></div>}        
                            
                {/* {this.props.state} */}
                </TableCell>
                <TableCell>{this.props.type}</TableCell>
                <TableCell><button><Link to={'/PostView/'+this.props.casenum+'/'+this.props.idx+'/'+this.props.keyword}>자세히 보기</Link></button></TableCell>
            </TableRow>
        )
    }
}

export default Evidence;