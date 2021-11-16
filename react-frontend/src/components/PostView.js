import React, { Component } from 'react';
import Header from './Header';
import axios from "axios";
import ViewFile from './ViewFile';
import ViewOCR from './ViewOCR'
import ViewArtifact from './ViewArtifact';
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
            <Header />
            <div className="wrap">
              <div className="flex-container-postview">
                <div className="flex-column-postview-container">
                  <span className="postview-h1-2">원본 파일</span>

                  {this.state.data ? (
                    this.state.data.map((c, i) => {
                      if (
                        (c.index == params.no) &
                        (c.filetype == "녹음 파일")
                      ) {
                        return (
                          <div className="postview-container-1">
                            <ViewFile
                              text={c.segments}
                              name={c.filename}
                              hashed_filename={c.hashed_filename}
                              keyword={params.keyword}
                              _id={c._id}
                            />
                          </div>
                        );
                      } else if (
                        (c.index == params.no) &
                        (c.filetype == "사진 파일")
                      ) {
                        return (
                          <div className="postview-container-1">
                            <ViewOCR hashed_filename={c.hashed_filename} />
                          </div>
                        );
                      } else if (
                        (c.index == params.no) &
                        (c.filetype == "컴퓨터 증거")
                      ) {
                        return (
                        <div className="postview-container-1">                          
                            <ViewArtifact data={this.state.data} object_id={c._id}/>
                        </div>
                        );
                      }
                      return null;
                    })
                  ) : (
                    <h1></h1>
                  )}
                </div>
                <div className="flex-column-postview-container2">
                  <span className="postview-h1-1">상세 정보</span>
                  <div className="postview-container-2">

                    <div className="flex-container-postview-contents">
                      <span className="date_title">일시</span>
                      <span className="date_content">
                        {this.props.location.state.datetime}
                      </span>
                    </div>
                    
                    <div className="flex-container-postview-contents">
                      <span className="date_title">발생장소</span>
                      <span className="date_content">
                        {this.props.location.state.location}
                      </span>
                    </div>

                    <div className="flex-container-postview-contents">
                      <span className="date_title">행위자</span>
                      <span className="date_content">
                        {this.props.location.state.attacker}
                      </span>
                    </div>

                    <div className="flex-container-postview-contents">
                      <span className="date_title">괴롭힘유형</span>
                      <span className="date_content">
                        {this.props.location.state.bullying}
                      </span>
                    </div>

                  </div>
                </div>
                </div>

                <div className="flex-container-postview-contents2">
                    <button
                      className="file_info_container"
                      onClick={this.openMetaModal}
                    >
                      파일정보
                    </button>
                    <button
                      className="is_edit_container"
                      onClick={this.openChangedModal}
                    >
                      편집여부
                    </button>
                  </div>
                  

                  <div className="flex-column-postview-container3">
                    <span className="postview-h1-3">상세설명</span>
                      <div className="postview-container-3">
                        <br />
                        <span className="desc_content">
                          {this.props.location.state.desc}
                        </span>
                      </div>
                  </div>

                  

                {this.state.data ? (
                  this.state.data.map((c, i) => {
                    if ((c.index == params.no) & (c.filetype == "녹음 파일")) {
                      return (
                        <>
                          <MetaModal
                            visible={this.state.isMetaModal}
                            type={c.filetype}
                            arr={c.metadata}
                            closeModal={this.closeMetaModal}
                          />

                          <ChangedModal
                            visible={this.state.isChangedModal}
                            type={c.filetype}
                            edited={c.edited}
                            manipulated={c.manipulated}
                            relatedMetadata = {c.relatedMetadata}
                            programNames = {c.programNames}
                            reason = {c.reason}
                            closeModal={this.closeChangedModal}
                          />
                        </>
                      );
                    } else if (
                      (c.index == params.no) &
                      (c.filetype == "사진 파일")
                    ) {
                      return (
                        <>
                          <MetaModal
                            visible={this.state.isMetaModal}
                            type={c.filetype}
                            arr={c.metadata}                   
                            closeModal={this.closeMetaModal}
                          />

                          <ChangedModal
                            visible={this.state.isChangedModal}
                            type={c.filetype}
                            manipulated={c.manipulated}
                            relatedMetadata = {c.relatedMetadata}
                            programNames = {c.programNames}
                            reason = {c.reason}
                            edited={c.edited}
                            closeModal={this.closeChangedModal}
                          />
                        </>
                      );
                    }
                    return null;
                  })
                ) : (
                  <h1></h1>
                )}
              </div>
              
            </div>
          
        );
    }
}

export default PostView;