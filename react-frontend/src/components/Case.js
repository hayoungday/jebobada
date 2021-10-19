import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {Link} from 'react-router-dom';
// import CustomerDelete from './CustomerDelete';

class Case extends React.Component {

    render() {
        // console.log(this.props.name)
        return (
            
            <TableRow >
                <TableCell style={{ textAlign: "center" }}>{this.props.id}</TableCell>
                <TableCell style={{ textAlign: "center" }}><Link to={{
                        pathname:'/upload/'+this.props.idx,
                        state:{casename: this.props.name}}
                    }>{this.props.name}</Link></TableCell>
                
                <TableCell style={{ textAlign: "center" }}>{this.props.description}</TableCell>
            </TableRow>
        )
    }
}
export default Case;