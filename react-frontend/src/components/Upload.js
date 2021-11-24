import React, {Component,useState} from 'react';
import { Link, RouteComponentProps } from "react-router-dom";

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
import ProgressButton from 'react-progress-button'
import { InputBase, Typography } from '@material-ui/core';
import SearchBox from './SearchBox';
import {withStyles} from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useLocation } from 'react-router-dom'
import Modal from "./Modal"
import "./Agree.css";
import Check_Modal from './Check_Modal';
import Agree_Modal from './Agree_Modal';
import SelectType_Modal from './SelectType_Modal';


let keyword=""

class Upload extends Component {
    
    constructor(props){
        super(props);

        this.state = {
            maxNo: 1,
            completed:0,
            userInput:"",
            user:"",
            file:null,
            fileName:"",
            isModalOpen: false,
            isSelectModalOpen: false,
            // dateFormats: ['d', 'D', 'M', 'd/M/yy', 'MMMM dd, yyyy'],
            location: "",
            attacker: "",
            description: "",
        }
        this.loadData = this.loadData.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.handleValueChange = this.handleValueChange.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)
        this.addEvidence = this.addEvidence.bind(this)
    }

    componentDidMount(){
        this.timer=setInterval(this.progress,20)
        this.intervalId = setInterval(() => this.loadData(), 500);
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
            let res= axios.get("/getevidences?keyword="+keyword+"&casenum="+this.props.match.params.casenum);
            
            return res
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
        this.setState({ boards: undefined });
        console.log("키워드")
        console.log(keyword)
    }
    searchClick=()=>{
        this.setState({boards:undefined});
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
        const formData = new FormData()
        formData.append('file',this.state.file)
        formData.append('filename',this.state.fileName)
        formData.append('user',this.state.user)
        formData.append('case_num',this.props.match.params.casenum)
        console.log(localStorage.getItem('key'))
        formData.append('key',localStorage.getItem('key'))
        let file_upload_res;

        const config = {
            headers: {
                'enctype':'multipart/form-data'
            }
        }     
        axios.post("/upload",formData,config).then((res)=>{
            if(res.data.result==="file_upload_block"){
                alert("동일한 파일이 존재합니다!")
            }
            res.data.result=""
        }
            
        )
        
    }   

    async callUserApi() {
        try {
            const res = await axios.get("/getuser");
            console.log(res)
            this.state.user = res.data.user;
            console.log(this.state.user)

            this.addEvidence()

        } catch (err) {
            return console.log(err);
        }
    }

    openModal = () => {
        this.setState({ isModalOpen: true });
    };
    closeModal=()=>{
      this.setState({isModalOpen:false});
    };

    agreeButton = (e) => {
      alert("영업기밀, 민감 정보 등의 등록은 주의해주시길 바랍니다.")
      e.preventDefault()
      console.log(this.state.isModalOpen, this.state.isSelectModalOpen)
      this.setState({isSelectModalOpen:true,isModalOpen:false})
      console.log(this.state.isModalOpen, this.state.isSelectModalOpen)

    }

    // agreement = () => {
      
    // };

    render() {
        // const {classes} =this.props;
        return (
          <div>
            <Header />

            <div className="wrap">
              <div className="flex-column-container">
                <div className="flex-container-case-box">
                  <div className="flex-column-content-container">
                    <span className="select-case-text">
                      괴롭힘 <span className="text_color">증거 자료</span>를
                      <span className="text_color"> 등록</span>하세요.
                    </span>
                    <p />
                    <p />
                    <span className="select-case-content">
                      직장 내 괴롭힘 관련 증거 자료(캡처/녹음 파일, 컴퓨터
                      사용기록 등)를 등록하여 증거 자료를 관리하세요.
                      <p />
                      등록 시, 육하원칙에 따라 피해 정황을 자세히 기록해두면
                      추후 신고할 때 큰 도움이 됩니다.
                    </span>
                  </div>
                  

                  <Agree_Modal
                    visible={this.state.isModalOpen}
                    agreeButton={this.agreeButton}
                  >
                    <button
                      className="close_icon_postview"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ isModalOpen: false });
                      }}
                    />
                  </Agree_Modal>
                  <SelectType_Modal visible={this.state.isSelectModalOpen}>
                    <button
                      className="close_icon_postview"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ isSelectModalOpen: false });
                      }}
                    />
                    <div className="flex-column-container-agree">
                      <span className="select-type-title">
                        등록할 증거 유형을 선택해주세요
                      </span>
                      <div className="flex-container-column-meta">
                        <div className="flex-container-select-type">
                          <Link
                            to={{
                              pathname: "/uploadevidence",
                              state: {
                                casenum: this.props.match.params.casenum,
                                user: this.state.user,
                              },
                            }}
                          >
                            <div className="self-upload-container">
                              <span className="self-upload-title">
                                직접 수집한 증거 자료
                              </span>
                              <p />
                              <span className="self-upload-text">
                                녹음파일, 사진파일, 캡쳐파일 등
                              </span>
                            </div>
                          </Link>
                          <Link
                            to={{
                              pathname: "/UploadEvidence_artifact",
                              state: {
                                casenum: this.props.match.params.casenum,
                                user: this.state.user,
                              },
                            }}
                          >
                            <div className="self-upload-container">
                              <span className="self-upload-title2">
                                컴퓨터 사용 기록
                              </span>
                              <p />
                              <span className="self-upload-text">
                                JB Extractor에서 추출한 컴퓨터 사용 기록
                              </span>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SelectType_Modal>
                </div>
                <div className="flex-search-box" style={{marginBottom:"3%"}}>

                  <div className="search-box">
                    <input
                      className="search-text-box"
                      type="search"
                      placeholder="    검색어를 입력하세요"
                      onChange={this.handleChange}
                    />
                    <button className="search_button" onClick={this.handleClick(this.state.userInput)}/>
                  </div>
                  
                  <button
                    className="add-case-button"
                    style={{ textDecoration: "none" }}
                    onClick={this.openModal}
                  >
                    증거 자료 등록
                  </button>

                </div>
                


                <div className="table_style">
                  <Table
                    style={{
                      tableLayout: "fixed",
                      wordBreak: "break-all",
                      wordWrap: "break-word",
                    }}
                  >
                    <colgroup>
                      <col style={{ width: "7%" }} />
                      <col style={{ width: "15%" }} />
                      <col style={{ width: "20%" }} />
                      <col style={{ width: "15%" }} />
                      <col style={{ width: "8%" }} />
                      <col style={{ width: "15%" }} />
                      <col style={{ width: "8%" }} />
                      <col style={{ width: "12%" }} />
                    </colgroup>
                    <TableHead>
                      <TableRow>
                        <TableCell className="table_cell_left">
                          <Typography variant="h6" className="table_head_typo">
                            번호
                          </Typography>
                        </TableCell>
                        <TableCell className="table_cell">
                          <Typography variant="h6" className="table_head_typo">
                            증거명
                          </Typography>
                        </TableCell>
                        <TableCell className="table_cell">
                          <Typography variant="h6" className="table_head_typo">
                            설명
                          </Typography>
                        </TableCell>
                        <TableCell className="table_cell">
                          <Typography variant="h6" className="table_head_typo">
                            괴롭힘 유형
                          </Typography>
                        </TableCell>
                        <TableCell className="table_cell">
                          <Typography variant="h6" className="table_head_typo">
                            분류
                          </Typography>
                        </TableCell>
                        <TableCell className="table_cell">
                          <Typography variant="h6" className="table_head_typo">
                            일시
                          </Typography>
                        </TableCell>
                        <TableCell className="table_cell">
                          <Typography variant="h6" className="table_head_typo">
                            상태
                          </Typography>
                        </TableCell>
                        <TableCell className="table_cell_right"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.boards ? (
                        this.state.boards.map((c, i) => {
                          return (
                            <Evidence
                              data={c.data}
                              object_id={c._id}
                              key={this.state.maxNo + i}
                              id={this.state.maxNo + i}
                              name={c.filename}
                              user_id={c.user_id}
                              type={c.filetype}
                              date={c.date}
                              idx={c.index}
                              state={c.state}
                              casenum={c.casenum}
                              keyword={this.state.userInput}
                              desc={c.desc}
                              bullying={c.type}
                              attacker={c.attacker}
                              location={c.location}
                            />
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <br></br>
                            <h6>loading....</h6>
                            <br></br>
                            <br></br>
                            <div className="circular_progress">
                              <CircularProgress variant="indeterminate" />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        ); 
    } 
}

export default Upload;