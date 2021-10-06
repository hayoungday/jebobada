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

let keyword=""

class Upload extends Component {
    
    constructor(props){
        super(props);

        this.state = {
            maxNo: 1,
            boards:[],
            completed:0,
            userInput:"",
            user:"",
            file:null,
            fileName:"",
        }
        this.loadData = this.loadData.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.handleValueChange = this.handleValueChange.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)
        this.addEvidence = this.addEvidence.bind(this)
    }

    componentDidMount(){
        this.intervalId = setInterval(() => this.loadData(), 5000);
        this.loadData();            
    }
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    async callApi() {
        console.log(this.props.match)
        console.log(this.props.match.params.casenum)
        let body = {
            user:this.state.user,
            casenum:this.props.match.params.casenum,
        }
        if(keyword){
            return axios.get("/getevidences?keyword="+keyword+"&casenum="+this.props.match.params.casenum);
        }
        else{
            return axios.post("/getevidences",body)
        }
        
    }

    async loadData(){
        const res = await axios.get("/getuser");
        this.state.user = res.data.user;

        this.callApi()
        .then(res => {
            console.log(res)
            console.log(res.data)
            console.log(typeof res.data)
            this.setState({boards:res.data})
        })
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
    handleClick=value=>()=>{
        keyword=value
        console.log("키워드")
        console.log(keyword)
    }

    /////////////////////////////////////////////////////////

    handleFormSubmit(e){
        e.preventDefault()
        this.callUserApi()
        .catch(err=>console.log(err))
    }

    handleValueChange(e){
        let nextState = {}
        nextState[e.target.name] = e.target.value
        this.setState(nextState)
    }

    handleFileChange(e){
        this.setState({
            file: e.target.files[0],
            fileName: e.target.value,
        })
    }

    addEvidence(){
        // let body = {
        //     filename:this.state.fileName,
        //     file:this.state.file,
        //     user:this.state.user,
        //     case_num:this.props.match.params.no,
        // }

        const formData = new FormData()
        formData.append('file',this.state.file)
        formData.append('filename',this.state.fileName)
        formData.append('user',this.state.user)
        formData.append('case_num',this.props.match.params.casenum)

        console.log(formData)
        console.log(typeof formData)

        const config = {
            headers: {
                'enctype':'multipart/form-data'
            }
        }

        return axios.post("/upload",formData,config)
        // return axios.post("/upload",formData)
    }

    async callUserApi() {
        try {
            const res = await axios.get("/getuser");
            this.state.user = res.data.user;
            console.log(this.state.user)

            this.addEvidence()

        } catch (err) {
            return console.log(err);
        }
    }


    render() {
       
        return (
            <div>

                <Header/>
                <br></br>
                <h1>증거물 업로드 페이지</h1>
                <h3>Case {this.props.match.params.casenum}</h3>
                <br></br>
                <form onSubmit={this.handleFormSubmit}>
                    <input type = "file" name = "file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange}/>
                    <button type = "submit">등록하기</button>
                </form>
                           
                <div>
                    <input 
                    className="search"
                    type="search"
                    placeholder="키워드"
                    onChange={this.handleChange}
                    />
                    <button onClick={this.handleClick(this.state.userInput)}>검색</button>                    
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
                    { this.state.boards ? this.state.boards.map((c,i) => {
                            return ( <Evidence key={this.state.maxNo + i} 
                                id={this.state.maxNo + i}
                                name={c.filename}
                                user_id={c.user_id}
                                type={c.filetype}
                                uploaded_time={c.uploaded_time} 
                                idx={c.index}
                                state={c.state}
                                casenum={c.casenum}
                                keyword={this.state.userInput}
                                />)
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