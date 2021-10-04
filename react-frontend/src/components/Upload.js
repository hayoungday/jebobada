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
import { InputBase } from '@material-ui/core';
import SearchBox from './SearchBox';

class Upload extends Component {
    

    state = {
        maxNo: 1,
        boards:[],
        completed:0,
        userInput:""
    }
    componentDidMount(){
        this.intervalId = setInterval(() => this.loadData(), 5000);
        this.loadData();            
    }
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    callApi = async() => {
        const response = await fetch('/getuser')
        const body = await response.json();
        console.log(body)
        return body
    }

    loadData(){
        this.callApi()
        .then(res => this.setState({boards:res}))
        .catch(err => console.log(err))
        console.log(this.state.boards)
    }

    progress = () =>{
        const { completed } = this.state;
        this.setState({completed: completed >=100 ? 0 : completed +1})
    }

    handleChange = (e) => {
        console.log(this.state.userInput)
                
        this.setState({
          userInput : e.target.value
        })
        
    }
    render() {
        const {maxNo,boards,completed,userInput}=this.state;
        const filteredData=boards.filter((data)=>{
            return data.text.includes(userInput);
        })
        return ( 
            <div>
                <Header/>
                <br></br>
                <h1>증거물 업로드 페이지</h1>
                <br></br>
                <form action = "/upload" method = "POST" enctype = "multipart/form-data">
                    <input type = "file" name = "file" />
                    <input type = "submit"/>
                </form>
                           
                <div>
                    <input 
                    className="search"
                    type="search"
                    placeholder="키워드"
                    onChange={this.handleChange}
                    />                    
                </div>             
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
                    { filteredData ? filteredData.map((c,i) => {
                            return ( <Evidence key={maxNo + i} 
                                id={maxNo + i}
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

class BoardItem extends React.Component { 
    render() { 
        return( 
            <tr> 
                <td>{this.props.row.brdno}</td> 
                <td>{this.props.row.brdtitle}</td> 
                <td>{this.props.row.brdwriter}</td> 
                <td>{this.props.row.brddate.toLocaleDateString('ko-KR')}</td> 
            </tr> 
        );
    }
}
export default Upload;