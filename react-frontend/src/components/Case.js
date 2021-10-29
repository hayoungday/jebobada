import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {Link} from 'react-router-dom';
import axios from 'axios';
import CaseEditModal from './CaseEdit_Modal'
// import CustomerDelete from './CustomerDelete';

class Case extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            isModalOpen: false,
        }
    }

    openModal = () => {
        this.setState({isModalOpen:true})
    }
    
    
    render() {
        // console.log(this.props.name)
        const handleDeleteButton=()=>{    
            console.log("button clicked!!!!")
    
            let body = {
                case_name: this.props.name,
                user: this.props.user,
                casenum: this.props.idx
            }
            return axios.post("/deletecase",body)
        }

        
        return (
            
            <TableRow>
                <TableCell style={{ textAlign: "center" }}>{this.props.id}</TableCell>
                <TableCell style={{ textAlign: "center" }}><Link to={{
                        pathname:'/upload/'+this.props.idx,
                        state:{casename: this.props.name}}
                    }>{this.props.name}</Link></TableCell>
                
                <TableCell style={{ textAlign: "center" }}>{this.props.description}</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                    <button onClick={this.openModal}>수정</button>
                    <CaseEditModal visible={this.state.isModalOpen} case_name = {this.props.name} user = {this.props.user}>
                        <button onClick = {(e) => {
                            e.preventDefault()
                            this.setState({isModalOpen:false})
                        }
                        }>닫기</button>
                    </CaseEditModal>
                    <button onClick={handleDeleteButton}>삭제</button>
                </TableCell>
            </TableRow>
        )
    }
}
export default Case;