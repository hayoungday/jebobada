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

    // state = { 
    //     boards: [ 
    //         { 
    //             brdno: 1, 
    //             brdwriter: 'Lee SunSin', 
    //             brdtitle: 'If you intend to live then you die', 
    //             brddate: new Date() 
    //         }, 
    //         { 
    //             brdno: 2, 
    //             brdwriter: 'So SiNo', 
    //             brdtitle: 'Founder for two countries', 
    //             brddate: new Date() 
    //         } 
    //     ] 
    // } 

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

    // loadItem = async() => {
    //     axios.get("/getuser")
    //     .then(res => {
    //         console.log(res)
    //         console.log(res.data)
    //         // console.log(res.data[0])
    //         console.log(res.data[0].filename)
    //         console.log(typeof res.data)
    //         // console.log(res[1].filename)
    //     })
    // }

    progress = () =>{
        const { completed } = this.state;
        this.setState({completed: completed >=100 ? 0 : completed +1})
    }

    render() { 
        // const { boards } = this.state; 
        // const list = boards.map(function(row){ 
        //     return row.brdno + row.brdwriter ; 
        // }); 
        
        return ( 
            <div>
                <Header/>
                <h1>This is Upload page</h1>
                <form action = "/upload" method = "POST" enctype = "multipart/form-data">
                    <input type = "file" name = "file" />
                    {/* <label className="input-file-button" for="input-file">
                        파일 업로드
                    </label> */}
                    <input type = "submit" />
                </form>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>번호</TableCell>
                            <TableCell>이름</TableCell>
                            <TableCell>피해자명</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { this.state.boards ? this.state.boards.map((c,i) => {
                            return ( <Evidence key={this.state.maxNo + i} id={this.state.maxNo + i} name={c.filename} user_id={c.user_id} />)
                            }):
                            <TableRow>
                                <TableCell colSpan="6" align="center">
                                    <CircularProgress variant = "determinate" value={this.state.completed}/>
                                </TableCell>

                            </TableRow>    
                        }
                    </TableBody>
                </Table>
                {/* <table border="1"> 
                    <tbody> 
                        <tr align="center"> 
                            <td width="50">No.</td> 
                            <td width="300">Title</td> 
                            <td width="100">Name</td> 
                            <td width="100">Date</td> 
                        </tr> 
                        { 
                            boards.map(row => 
                                (<BoardItem key={row.brdno} row={row} />) 
                            ) 
                        } 
                    </tbody> 
                </table> */}
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