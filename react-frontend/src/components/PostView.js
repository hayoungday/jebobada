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
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';


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

    closeMetaModal = () => {
        this.setState({isMetaModal:false})
    }

    closeChangedModal = () => {
        this.setState({isChangedModal:false})
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
                <div className="wrap">
                    <div className="flex-container-postview">
                        <div className="flex-column-postview-container2">
                            <span className="postview-h1-2">
                                원본 파일
                            </span>

                            {this.state.data?this.state.data.map((c,i)=>{
                            
                            if(c.index==params.no & c.filetype == "녹음 파일"){
                                return(
                                    <div>
                                        <ViewFile text={c.segments} name={c.filename} hashed_filename={c.hashed_filename} keyword={params.keyword} _id={c._id}/>
                                    </div>
                                )
                            }
                            else if (c.index==params.no & c.filetype == "사진 파일"){
                                return(
                                    <div>
                                        <ViewOCR hashed_filename={c.hashed_filename}/>
                                    </div>
                                )
                            }
                            return (null)
                            }):
                            <h1></h1>   
                            }
                        </div>
                    <div className="flex-column-postview-container">
                        <span className="postview-h1-1">
                            증거 정보 요약
                        </span>
                        <div className="postview-container-1">
                            <div className="flex-container-postview-contents">
                                <span className="date_title">일시</span>
                                <span className="date_content">{this.props.location.state.datetime}</span>
                                <span className="date_title">발생장소</span>
                                <span className="date_content">{this.props.location.state.location}</span>
                            </div>
                            <br/>
                            <div className="flex-container-postview-contents">
                                <span className="date_title">행위자</span>
                                <span className="date_content">{this.props.location.state.attacker}</span>
                                <span className="date_title">괴롭힘유형</span>
                                <span className="date_content">{this.props.location.state.bullying}</span>
                            </div>
                        </div>

                        <div className="postview-container-2">
                        <span className="desc_title">상세설명</span>
                        <br/>
                        <span className="desc_content">{this.props.location.state.desc}</span>
                        </div>
                        <div className="flex-container-postview-contents2">
                            <button className="file_info_container" onClick={this.openMetaModal}>파일정보</button>
                            <button className="is_edit_container" onClick={this.openChangedModal}>편집여부</button>
                        </div>
                    </div>
                    
                    {this.state.data?this.state.data.map((c,i)=>{
                    
                    if(c.index==params.no & c.filetype == "녹음 파일"){
                        return(
                            <>
                                <MetaModal visible={this.state.isMetaModal} type={c.filetype} arr={c.metadata} closeModal={this.closeMetaModal}/>

                                <ChangedModal visible={this.state.isChangedModal} type={c.filetype} closeModal = {this.closeChangedModal}/>
                            </>
                        )
                    }
                    else if (c.index==params.no & c.filetype == "사진 파일"){
                        return(
                            <>    
                                <MetaModal visible={this.state.isMetaModal} type={c.filetype} arr={c.metadata} closeModal={this.closeMetaModal}/>

                                <ChangedModal visible={this.state.isChangedModal} type={c.filetype} closeModal = {this.closeChangedModal}/>
                            </>
                        )
                    }
                    return (null)
                }):
                <h1></h1>   
            }
                        
                    
                </div>
                {/* <div class="flex-container">
                    <div class="flex-child-left">
                        <h1>증거 정보 요약</h1>
                        <Card variant="outlined">
                            <CardContent>
                                <h5 style={{display:"inline"}}>일시</h5>
                                {this.props.location.state.datetime} &nbsp;&nbsp;&nbsp;
                                <h5 style={{display:"inline"}}>발생장소</h5>
                                {this.props.location.state.location}
                                <br/>
                                <h5 style={{display:"inline"}}>행위자</h5>
                                {this.props.location.state.attacker} &nbsp;&nbsp;&nbsp;
                                <h5 style={{display:"inline"}}>괴롭힘 유형</h5>
                                {this.props.location.state.bullying}
                            </CardContent>
                        </Card>
                        <Table>
                            <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
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
                            </TableHead>
                        </Table>

                        {this.state.data?this.state.data.map((c,i)=>{
                    
                                if(c.index==params.no & c.filetype == "녹음 파일"){
                                    return(
                                        <div>
                                            <div className="flex-container-first-box">
                                                <button className="button_postview" onClick={this.openMetaModal}>파일 정보 확인</button>
                                                <button className="button_postview" onClick={this.openChangedModal}>편집여부 확인</button>
                                            </div>
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
                                        </div>
                                    )
                                }
                                else if (c.index==params.no & c.filetype == "사진 파일"){
                                    return(
                                        <div>
                                            <div className="flex-container-first-box">                                            
                                            <button className="button_postview" onClick={this.openMetaModal}>파일 정보 확인</button>
                                            <button className="button_postview" onClick={this.openChangedModal}>편집여부 확인</button>
                                            </div>
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
                                        </div>
                                    )
                                }
                                return (null)
                            }):
                            <h1></h1>   
                        }


                    </div>
                    <div class="flex-child-right">                                
                    <h1>원본 파일</h1>
                    
                {this.state.data?this.state.data.map((c,i)=>{
                    
                    if(c.index==params.no & c.filetype == "녹음 파일"){
                        return(
                            <div>
                                <ViewFile text={c.segments} name={c.filename} hashed_filename={c.hashed_filename} keyword={params.keyword} _id={c._id}/>
                            </div>
                        )
                    }
                    else if (c.index==params.no & c.filetype == "사진 파일"){
                        return(
                            <div>
                                <ViewOCR hashed_filename={c.hashed_filename}/>
                            </div>
                        )
                    }
                    return (null)
                }):
                <h1></h1>   
            }
                
            </div>
            </div> */}
            </div>
            </div>
        );
    }
}

export default PostView;