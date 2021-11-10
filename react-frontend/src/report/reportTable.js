import React, {Component, useState} from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {Link} from 'react-router-dom';
import axios from 'axios';
// import CustomerDelete from './CustomerDelete';

class reportTable extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            isModalOpen: false,
            createtime: "-",
            isCreated: false,
        }

    }

    CreateButtonClicked =()=> {
        let today = new Date();
        let month = today.getMonth() + 1
        let today_date = today.getFullYear() + "." + month + "." + today.getDate() + "."
        this.setState({createtime:today_date})
        this.setState({isCreated:true})
    }

    CreateButton=()=>{
        return(
            <button onClick = {this.CreateButtonClicked} style={{border:'none'}}>
                 <img src='./static/react/create_report.png' style={{ width: '80px' }}/>
            </button>
        )
    }

    ShowButton=()=>{
        return(
            <Link to='/mainbullying' style={{textDecoration:'none'}}>
                <button style={{border:'none'}}>
                     <img src='./static/react/show_report.png' style={{ width: '80px' }}/>
                </button>
            </Link>
        )
    }

    Updatebutton=()=>{
        return(
            <button style={{border:'none'}}>
                 <img src='./static/react/update.png' style={{ width: '20px'}}/>
            </button>
        )
    }
    
    
    render() {
        // console.log(this.props.name)
        
        let report_button
        let update_button = this.Updatebutton()

        if (this.state.isCreated == true) {
            report_button = this.ShowButton()
        } else {
            report_button = this.CreateButton()
        }

        return (
            
            <TableRow>
                <TableCell style={{ textAlign: "center" }}>{this.props.id}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{this.props.name}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{this.state.createtime}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{report_button}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{update_button}</TableCell>
            </TableRow>
        )
    }
}
export default reportTable;