import React, {Component,useState} from 'react';
import Header from './Header';
import axios from 'axios';
import Case from './Case';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CircularProgress from '@material-ui/core/CircularProgress';
import { InputBase } from '@material-ui/core';
import SearchBox from './SearchBox';

class CasePage extends Component {

    constructor(props){
        super(props);
        
        this.state = {
            user:"",
            case_name:"",
            description:"",
            cases:[],
            maxNo:1,
            completed:0,
        }

        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.handleValueChange = this.handleValueChange.bind(this)
        this.addCase = this.addCase.bind(this)
        this.loadData = this.loadData.bind(this)
    }

    componentDidMount(){
        this.intervalId = setInterval(() => this.loadData(), 10000);
        this.loadData();
    }
    
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }
    
    async callApi() {
        let body = {
            user:this.state.user,
        }
        return axios.post("/getcases",body)
    }

    async loadData(){
        const res = await axios.get("/getuser");
        this.state.user = res.data.user;
        console.log(this.state.user)
        
        this.callApi()
        .then(res => {
            console.log(res)
            console.log(res.data)
            console.log(typeof res.data)
            this.setState({cases:res.data})
            console.log(this.state.cases)
        })
        .catch(err => console.log(err))
        console.log(this.state.cases)
    }

    progress = () =>{
        const { completed } = this.state;
        this.setState({completed: completed >=100 ? 0 : completed +1})
    }

    // async handleReset(){
    //     this.state.case_name = ""
    //     this.state.description = ""
    // }

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

    addCase(){
        let body = {
            case_name:this.state.case_name,
            description:this.state.description,
            user:this.state.user,
        }

        return axios.post("/casepage",body)
    }

    async callUserApi() {
        try {
            const res = await axios.get("/getuser");
            this.state.user = res.data.user;
            console.log(this.state.user)

            this.addCase()

        } catch (err) {
            return console.log(err);
        }
    }

    render() {

        return ( 
            <div>
                <Header/>
                <br></br>
                <h1>CASES</h1>
                <br></br>
                <form onSubmit={this.handleFormSubmit}>
                    케이스명: <input type = "text" name = "case_name" placeholder="케이스명" value={this.state.case_name} onChange={this.handleValueChange}/><br/>
                    한줄설명: <input type = "text" name = "description" placeholder="한줄설명" value={this.state.description} onChange={this.handleValueChange} /><br/>
                    <button class="btn btn-primary">등록</button>
                </form>

                <Table> 
                    <TableHead>
                        <TableRow>
                            <TableCell>번호</TableCell>
                            <TableCell>케이스명</TableCell>
                            <TableCell>설명</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {console.log(typeof this.state.cases)}
                    { this.state.cases ? this.state.cases.map((c,i) => {
                        return ( <Case key={this.state.maxNo + i} 
                            id={this.state.maxNo + i}
                            name={c.CaseName}
                            description={c.Description}
                            idx={c.index}
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

export default CasePage;