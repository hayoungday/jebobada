import React, { Component } from 'react';
import Header from './Header';
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
import ViewFile from './ViewFile';
import ViewOCR from './ViewOCR'
import Meta from './Meta';
import './PostView.css';
class PostView extends Component {
    state={
        data:"",
    }
    componentDidMount(){
        this.timer = setInterval(this.progress,20)
        this.callApi()
        .then(res => this.setState({data:res}))
        .catch(err => console.log(err))
    }

    callApi = async() => {
        const response = await fetch('/getuser')
        const body = await response.json();
        console.log(body)
        console.log("hi!")
        return body
    }
    
    render() {
        
        const { params } = this.props.match; // 접근하는 파일의 idx값
        
        return (
            <div>
                <Header/>
                <div class="flex-container">
                    <div class="flex-child magenta">
                        <Meta/>                    
                    </div>
                    <div class="flex-child green">                                
                {this.state.data?this.state.data.map((c,i)=>{
                    if(c.index==params.no & c.filetype == "녹음 파일"){
                        console.log(c.segments)                                                                                           
                        return(<ViewFile text={c.segments} name={c.filename} hashed_filename={c.hashed_filename}/>)
                    }
                    else if (c.index==params.no & c.filetype == "사진 파일"){
                        console.log(c.fullscript)
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