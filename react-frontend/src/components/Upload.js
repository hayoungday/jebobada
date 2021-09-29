import React, {Component,useState} from 'react';
import Header from './Header';
import axios from 'axios';
import Evidence from './Evidence';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CircularProgress from '@material-ui/core/CircularProgress';

class Upload extends Component { 

    state = {
        maxNo: 1,
        boards:"",
        completed:0
    }
    componentDidMount(){
        // this.loadItem();
        this.timer = setInterval(this.progress,20)
        this.callApi()
        .then(res => this.setState({boards:res}))
        .catch(err => console.log(err))
    }

    callApi = async() => {
        const response = await fetch('/getuser')
        const body = await response.json();
        console.log(body)
        return body
    }

    progress = () =>{
        const { completed } = this.state;
        this.setState({completed: completed >=100 ? 0 : completed +1})
    }

    render() { 

        return ( 
            <div>
                <Header/>
                <h1>This is Upload page</h1>
                <form action = "/upload" method = "POST" enctype = "multipart/form-data">
                    <input type = "file" name = "file" />
                    <input type = "submit" />
                </form>
                
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>번호</TableCell>
                            <TableCell>이름</TableCell>
                            <TableCell>업로드 시간</TableCell>
                            <TableCell>상태</TableCell>
                            <TableCell>분류</TableCell>
                            <TableCell>자세히 보기</TableCell>                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { this.state.boards ? this.state.boards.map((c,i) => {
                            return ( <Evidence key={this.state.maxNo + i} 
                                id={this.state.maxNo + i} 
                                name={c.filename} 
                                user_id={c.user_id} 
                                type={c.filetype}
                                uploaded_time={c.uploaded_time} 
                                idx={c.index}
                                state={c.state}/>)
                                
                            }):
                            <TableRow>
                                <TableCell colSpan="6" align="center">
                                    <CircularProgress variant = "determinate" value={this.state.completed}/>
                                    
                                </TableCell>

                            </TableRow>    
                        }
                        
                    </TableBody>
                </Table>
            </div> 
        ); 
    } 
}


export default Upload;