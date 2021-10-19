import React, { Component } from "react";
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

class Access_log extends Component {
  render() {
    return (
      <TableRow>
        <TableCell>{this.props.access_time}</TableCell>
        <TableCell>{this.props.access_ip}</TableCell>
        <TableCell>{this.props.login}</TableCell>
      </TableRow>
    );
  }
}

export default Access_log;