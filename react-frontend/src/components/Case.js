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

    closeModal = () => {
        this.setState({isModalOpen:false})
    }
    
    
    render() {
        // console.log(this.props.name)
        const handleDeleteButton=()=>{
            var message = "정말로 삭제하시겠습니까?\n사건 내에 저장되어 있는 모든 증거가 삭제됩니다."
            
            const result = window.confirm(message)

            if (result){
                console.log("button clicked!!!!")
    
                let body = {
                    case_name: this.props.name,
                    user: this.props.user,
                    casenum: this.props.idx
                }
                return axios.post("/deletecase",body)
            } else{
                console.log('취소되었습니다.')
            }
            
            
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
                    <CaseEditModal visible={this.state.isModalOpen} case_name = {this.props.name} user = {this.props.user} closeModal = {this.closeModal} desc = {this.props.description}>
                        
                    </CaseEditModal>
                    <button onClick={handleDeleteButton}>삭제</button>
                </TableCell>
            </TableRow>
        )
    }
}
export default Case;