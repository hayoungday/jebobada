import React, { Component } from 'react';
import Header from './Header';
import axios from "axios";
import ViewFile from './ViewFile';
import ViewOCR from './ViewOCR'
import Meta from './Meta';
import './PostView.css';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@material-ui/core';
import MetaModal from './MetaModal';
import ChangedModal from './ChangedModal';

class PostView extends Component {

    constructor(props){
        super(props);

        this.state = {
            data:[],
            user:"",
            isMetaModal: false,
            isChangedModal: false,
        }
        this.loadData = this.loadData.bind(this)
    }

    openMetaModal = () => {
        this.setState({isMetaModal:true})
    }

    openChangedModal = () => {
        this.setState({isChangedModal:true})
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
                        {console.log(this.props)}
                        <Table>
                            <TableRow>
                                <TableCell>일시</TableCell>
                                <TableCell>{this.props.location.state.datetime}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>행위자</TableCell>
                                <TableCell>{this.props.location.state.attacker}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>발생장소</TableCell>
                                <TableCell>{this.props.location.state.location}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>괴롭힘 유형</TableCell>
                                <TableCell>{this.props.location.state.bullying}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>상세설명</TableCell>
                                <TableCell>{this.props.location.state.desc}</TableCell>
                            </TableRow>
                        </Table>
                    </div>
                    <div class="flex-child green">                                
                    <h1>원본 파일</h1>
                    
                {this.state.data?this.state.data.map((c,i)=>{
                    
                    if(c.index==params.no & c.filetype == "녹음 파일"){
                        return(
                            <div>
                                <button onClick={this.openMetaModal}>파일 정보 확인</button>
                                <button onClick={this.openChangedModal}>편집여부 확인</button>
                                <MetaModal visible={this.state.isMetaModal} type={c.filetype} arr={c.metadata}>
                                    <button onClick={(e) => {
                                        e.preventDefault()
                                        this.setState({isMetaModal: false})
                                    }}>닫기</button>
                                </MetaModal>

                                <ChangedModal visible={this.state.isChangedModal} type={c.filetype}>
                                    <button onClick={(e) => {
                                        e.preventDefault()
                                        this.setState({isChangedModal: false})
                                    }}>닫기</button>
                                </ChangedModal>

                                <ViewFile text={c.segments} name={c.filename} hashed_filename={c.hashed_filename} keyword={params.keyword}/>
                            </div>
                        )
                    }
                    else if (c.index==params.no & c.filetype == "사진 파일"){
                        return(
                            <div>

                                <button onClick={this.openMetaModal}>파일 정보 확인</button>
                                <button onClick={this.openChangedModal}>편집여부 확인</button>
                                <MetaModal visible={this.state.isMetaModal} type={c.filetype} arr={c.metadata}>
                                    <button onClick={(e) => {
                                        e.preventDefault()
                                        this.setState({isMetaModal: false})
                                    }}>닫기</button>
                                </MetaModal>

                                <ChangedModal visible={this.state.isChangedModal} type={c.filetype}>
                                    <button onClick={(e) => {
                                        e.preventDefault()
                                        this.setState({isChangedModal: false})
                                    }}>닫기</button>
                                </ChangedModal>

                                <ViewOCR hashed_filename={c.hashed_filename}/>
                            </div>
                        )
                    }
                    return (null)
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