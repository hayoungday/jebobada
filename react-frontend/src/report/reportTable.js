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
            createtime: "",
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
                 <img src='./static/react/group94.png' style={{ width: '80px' }}/>
            </button>
        )
    }

    ShowButton=()=>{
        return(
            <Link to={{pathname:'/mainbullying',state:{case_id:this.props._id}}} style={{textDecoration:'none'}}>
                <button style={{border:'none'}}>
                     <img src='./static/react/group100.png' style={{ width: '80px' }}/>
                </button>
            </Link>
        )
    }

    Updatebutton=()=>{
        return(
            <button style={{border:'none'}} >
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
            
            <div className="casepage_test_case_box">
                {/* <Link
                    to={{
                        pathname: "/upload/" + c.index,
                        state: { casename: c.CaseName },
                    }}
                    > */}
                <Link to={{pathname:'/mainbullying',state:{case_id:this.props._id}}} style={{textDecoration:'none'}}>
                    <div className="casepage_test_case_box_title">
                        {this.props.name}
                    </div>
                </Link>
                {/* </Link> */}
                
                <span className="casepage_test_case_box_desc">{this.props.description}</span>
                {/* <div className="jb-case-item-flex-container">
                    <div className="jb-rp-items1">{this.state.createtime}</div>
                    <div className="jb-rp-items2">{report_button}</div>
                </div> */}
            </div>
        )
    }
}
export default reportTable;