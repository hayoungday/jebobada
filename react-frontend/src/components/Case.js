import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {Link} from 'react-router-dom';
// import CustomerDelete from './CustomerDelete';

class Case extends React.Component {
    // callApi = async() => {
    //     const response = await fetch('/getuser')
    //     const body = await response.json();
    //     console.log(body)
    //     return body
    // }
    render() {
        return (            
            <TableRow>
                <TableCell>{this.props.id}</TableCell>
                <TableCell><Link to = {'/upload/'+this.props.idx}>{this.props.name}</Link></TableCell>
                <TableCell>{this.props.description}</TableCell>
            </TableRow>
        )
    }
}
export default Case;