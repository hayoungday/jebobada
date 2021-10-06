import React, { Component } from 'react';
import Header from './Header';
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
import ViewFile from './ViewFile';
import ViewOCR from './ViewOCR'
import Meta from './Meta';
import './PostView.css';
class PostView extends Component {

    constructor(props){
        super(props);

        this.state = {
            data:[],
            user:"",
        }
        this.loadData = this.loadData.bind(this)
    }

    componentDidMount(){
        // this.intervalId = setInterval(() => this.loadData(), 5000);
        this.loadData();            
    }
    // componentWillUnmount() {
    //     clearInterval(this.intervalId);
    // }

    async callApi() {

        let body = {
            user:this.state.user,
            idx:this.props.match.params.no,
            casenum:this.props.match.params.casenum,
        }
        return axios.post("/getevidences",body)
    }

    async loadData(){
        const res = await axios.get("/getuser");
        this.state.user = res.data.user;

        this.callApi()
        .then(res => {
            console.log(res)
            console.log(res.data)
            console.log(typeof res.data)
            this.setState({data:res.data})
        })
        .catch(err => console.log(err))
        console.log(this.state.data)
    }

    
    render() {
        {console.log(this.state.data)}
        const { params } = this.props.match; // 접근하는 파일의 idx값
        
        return (
            <div>
                <Header/>
                <div class="flex-container">
                    <div class="flex-child magenta">
                        {/* <Meta/> */}
                {this.state.data?this.state.data.map((c,i)=>{
                    if(c.index==params.no & c.filetype == "녹음 파일"){                                                                              
                        return(<Meta metadata={c.metadata}/>)
                    }
                    else if (c.index==params.no & c.filetype == "사진 파일"){
                        return(<Meta metadata={c.metadata}/>)
                    }
                    else{
                        console.log("error")
                    }
                    return null;
                }):
                <h1></h1>   
                }   
                    </div>
                    <div class="flex-child green">                                
                {this.state.data?this.state.data.map((c,i)=>{
                    if(c.index==params.no & c.filetype == "녹음 파일"){
                        return(<ViewFile text={c.segments} name={c.filename} hashed_filename={c.hashed_filename}/>)
                    }
                    else if (c.index==params.no & c.filetype == "사진 파일"){
                        return(<ViewOCR hashed_filename={c.hashed_filename}/>)
                    }
                    return null;
                }):
                <h1></h1>   
            }
            </div>
            </div>

            </div>
        );
    }
}

export default PostView;