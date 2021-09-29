import React, { Component } from 'react';
import Header from './Header';
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
import ViewFile from './ViewFile';
class PostView extends Component {
    state={
        data:""
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
                
                {/*<h1>{params.no}</h1>*/}
                {this.state.data?this.state.data.map((c,i)=>{
                    if(c.index==params.no){
                        return(<ViewFile text={c.text} name={c.filename}/>)
                    }
                    return null;
                }):
                <h1></h1>   
            }

            </div>
        );
    }
}

export default PostView;