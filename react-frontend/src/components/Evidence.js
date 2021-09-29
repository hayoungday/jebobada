import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {Link} from 'react-router-dom';
// import CustomerDelete from './CustomerDelete';

class Customer extends React.Component {
    render() {
        return (
            <TableRow>
                <TableCell>{this.props.id}</TableCell>
                {/* <TableCell><img src={this.props.image} alt="profile"/></TableCell> */}
                <TableCell>{this.props.name}</TableCell>
                <TableCell>{this.props.uploaded_time}</TableCell>
                <TableCell>{this.props.state}</TableCell>
                <TableCell>{this.props.type}</TableCell>
                <TableCell><button><Link to={'/PostView/'+this.props.idx}>자세히 보기</Link></button></TableCell>
                {/* <TableCell>{this.props.gender}</TableCell>
                <TableCell>{this.props.job}</TableCell> */}
                {/* <TableCell><CustomerDelete stateRefresh={this.props.stateRefresh} id={this.props.id}/></TableCell> */}
            </TableRow>
        )
    }
}

export default Customer;