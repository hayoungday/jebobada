import React, { Component, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";

import Header from "./Header";
import axios from "axios";
import Evidence from "./Evidence";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import CircularProgress from "@material-ui/core/CircularProgress";
import ProgressButton from "react-progress-button";
import { InputBase } from "@material-ui/core";
import SearchBox from "./SearchBox";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useLocation } from "react-router-dom";
import Modal from "./Modal";
import "./Agree.css";
import Check_Modal from "./Check_Modal";
import Agree_Modal from "./Agree_Modal";
import SelectType_Modal from "./SelectType_Modal";

let keyword = "";

class Upload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      maxNo: 1,
      completed: 0,
      userInput: "",
      user: "",
      file: null,
      fileName: "",
      isModalOpen: false,
      isSelectModalOpen: false,
      // dateFormats: ['d', 'D', 'M', 'd/M/yy', 'MMMM dd, yyyy'],
      location: "",
      attacker: "",
      description: "",
      filetype:"",
      id:""
    };
    this.loadData = this.loadData.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.addEvidence = this.addEvidence.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.progress, 20);
    this.intervalId = setInterval(() => this.loadData(), 3000);
    this.loadData();
  }
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  async callApi() {
    console.log(this.props.match);
    console.log(this.props.match.params.casenum);
    let body = {
      user: this.state.user,
      casenum: this.props.match.params.casenum,
    };
    if (keyword) {
      let res = axios.get(
        "/getevidences?keyword=" +
          keyword +
          "&casenum=" +
          this.props.match.params.casenum
      );

      return res;
    } else {
      return axios.post("/getevidences", body);
    }
  }

  async loadData() {
    const res = await axios.get("/getuser");
    this.state.user = res.data.user;

    this.callApi()
      .then((res) => {
        console.log(res);
        console.log(res.data);
        console.log(typeof res.data);
        this.setState({ boards: res.data });
      })
      .catch((err) => console.log(err));
    console.log(this.state.boards);
  }

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 1 });
  };

  handleChange = (e) => {
    console.log(this.state.userInput);

    this.setState({
      userInput: e.target.value,
    });
  };
  handleClick = (value) => () => {
    keyword = value;
    this.setState({ boards: undefined });
    console.log("키워드");
    console.log(keyword);
  };
  searchClick = () => {
    this.setState({ boards: undefined });
  };

  /////////////////////////////////////////////////////////

  handleFormSubmit(e) {
    e.preventDefault();
    this.callUserApi().catch((err) => console.log(err));
  }

  handleValueChange(e) {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  handleFileChange(e) {
    this.setState({
      file: e.target.files[0],
      fileName: e.target.value,
    });
  }

  addEvidence() {
    const formData = new FormData();
    formData.append("file", this.state.file);
    formData.append("filename", this.state.fileName);
    formData.append("user", this.state.user);
    formData.append("case_num", this.props.match.params.casenum);
    let file_upload_res;

    const config = {
      headers: {
        enctype: "multipart/form-data",
      },
    };
    axios.post("/upload", formData, config).then((res) => {
      if (res.data.result === "file_upload_block") {
        alert("동일한 파일이 존재합니다!");
      }
      res.data.result = "";
      console.log(res)
    });
  }

  async callUserApi() {
    try {
      const res = await axios.get("/getuser");
      console.log(res);
      this.state.user = res.data.user;
      console.log(this.state.user);

      this.addEvidence();
    } catch (err) {
      return console.log(err);
    }
  }

  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  // agreement = () => {

  // };

  render() {
    // const {classes} =this.props;
    return (
      <div className="flex-column-container">
        <Header />
        <div className="flex-container-agree">
          <div className="agree-box" style={{ backgroundColor: "#dee5f8" }}>
            <span className="agree-text" style={{ color: "000" }}>
              개인정보
              <p />
              수집 및 이용 동의
            </span>
          </div>
          <img
            className="connect-square"
            src="../static/react/square_icon.png"
          />
          <div className="case-box" style={{ backgroundColor: "#dee5f8" }}>
            <span className="case-text" style={{ color: "#000" }}>
              사건 생성 및 선택
            </span>
          </div>
          <img
            className="connect-square"
            src="../static/react/square_icon.png"
          />
          <div className="upload-box" style={{ backgroundColor: "#3d7be6" }}>
            <span className="upload-text" style={{ color: "#fff" }}>
              증거 등록
            </span>
          </div>
        </div>
        <div>
          <input
            className="search"
            type="search"
            placeholder="키워드"
            onChange={this.handleChange}
          />
          <button onClick={this.handleClick(this.state.userInput)}>검색</button>
        </div>

        <div className="flex-column-container">
          <div className="flex-container-case-box">
            <div className="flex-column-content-container">
              <span className="select-case-text">증거를 등록해주세요</span>
              <span className="select-case-content">
                사건에 해당하는 증거들을 등록해주세요
                <p />
                자세하게 적을 수록 신고 시에 도움이 많이 됩니다
              </span>
            </div>
            <button
              className="add-case-button"
              style={{ textDecoration: "none" }}
            >
              <button onClick={this.openModal}>
                <span className="add-case-button-content">증거 등록</span>
              </button>
              <Agree_Modal visible={this.state.isModalOpen}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    {
                      alert(
                        "영업기밀, 민감 정보 등의 등록은 주의해주시길 바랍니다."
                      );
                    }
                    this.setState({
                      isModalOpen: false,
                      isSelectModalOpen: true,
                    });
                  }}
                >
                  개인정보 수집 및 이용에 동의합니다
                </button>
              </Agree_Modal>
              <SelectType_Modal visible={this.state.isSelectModalOpen}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ isSelectModalOpen: false });
                  }}
                >
                  닫기
                </button>
                <Link
                  to={{
                    pathname: "/uploadevidence",
                    state: {
                      casenum: this.props.match.params.casenum,
                      user: this.state.user,
                    },
                  }}
                >
                  <button>직접 증거 등록</button>
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
                  <button>컴퓨터 사용기록 등록</button>
                </Link>
              </SelectType_Modal>
            </button>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: "center" }}>번호</TableCell>
                <TableCell style={{ textAlign: "center" }}>증거명</TableCell>
                <TableCell style={{ textAlign: "center" }}>설명</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  괴롭힘유형
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>분류</TableCell>
                <TableCell style={{ textAlign: "center" }}>일시</TableCell>
                <TableCell style={{ textAlign: "center" }}>상태</TableCell>
                <TableCell style={{ textAlign: "center" }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.boards ? (
                this.state.boards.map((c, i) => {
                  return (
                    <Evidence
                      object_id={c._id.$oid}
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
                    <CircularProgress
                      variant="indeterminate"
                      value={this.state.completed}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

export default Upload;
