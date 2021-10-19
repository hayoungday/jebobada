import React, { Component, useState } from "react";
import Header from "./Header";
import axios from "axios";
import Case from "./Case";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import CircularProgress from "@material-ui/core/CircularProgress";
import { InputBase } from "@material-ui/core";
import SearchBox from "./SearchBox";
import Modal from "./Modal";

import "./Agree.css";

class CasePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      case_name: "",
      description: "",
      cases: [],
      maxNo: 1,
      completed: 0,
      isModalOpen: false,
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.addCase = this.addCase.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.intervalId = setInterval(() => this.loadData(), 5000);
    this.loadData();
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  async callApi() {
    let body = {
      user: this.state.user,
    };
    return axios.post("/getcases", body);
  }

  async loadData() {
    const res = await axios.get("/getuser");
    this.state.user = res.data.user;
    console.log(this.state.user);

    this.callApi()
      .then((res) => {
        console.log(res);
        console.log(res.data);
        console.log(typeof res.data);
        this.setState({ cases: res.data });
        console.log(this.state.cases);
      })
      .catch((err) => console.log(err));
    console.log(this.state.cases);
  }

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 1 });
  };

  handleFormSubmit(e) {
    e.preventDefault();
    this.callUserApi().catch((err) => console.log(err));
  }

  handleValueChange(e) {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  addCase() {
    let body = {
      case_name: this.state.case_name,
      description: this.state.description,
      user: this.state.user,
    };

    return axios.post("/casepage", body);
  }

  async callUserApi() {
    try {
      const res = await axios.get("/getuser");
      this.state.user = res.data.user;
      console.log(this.state.user);

      this.addCase();
    } catch (err) {
      return console.log(err);
    }
  }

  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  render() {
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
          <img className="connect-square" src="./static/react/square_icon.png"/>
          <div className="case-box" style={{ backgroundColor: "#3d7be6" }}>
            <span className="case-text" style={{ color: "#fff" }}>
              사건 생성 및 선택
            </span>
          </div>
          <img className="connect-square" src="./static/react/square_icon.png"/>
          <div className="upload-box" style={{ backgroundColor: "#dee5f8" }}>
            <span className="upload-text" style={{ color: "#000" }}>
              증거 등록
            </span>
          </div>
        </div>
        <div className="flex-column-container">
          <div className="flex-container-case-box">
            <div className="flex-column-content-container">
              <span className="select-case-text">
                증거를 등록할 사건을 선택해주세요
              </span>
              <span className="select-case-content">
                기간, 괴롭힘 유형 등 자신만의 분류 기준으로 사건을 생성하여
                관리하면
                <p />
                더욱 체계적인 보고서 생성이 가능합니다.
              </span>
            </div>
              <button className="add-case-button" onClick={this.openModal}>
                <span className="add-case-button-content">사건 추가</span>
              </button>
              <Modal visible={this.state.isModalOpen}>
                <button class = "close_button" onClick={() => {this.setState({isModalOpen: false});}}>
                  <img class = "close_button_img" src="./static/react/close_icon.png" />
                </button>
                {/* <img src="./static/react/close_icon.png" style={{ float: "right" }}>
                  <button  onClick={() => {this.setState({isModalOpen: false});}}/>
                </img> */}
                <div className="flex-column-container">
                <span className="modal_title">사건 정보를 작성해주세요</span>
                <form onSubmit={this.handleFormSubmit}>
                  <div className="flex-container-first-box">
                    <span className="case_name"> 사건명:{" "}</span>
                    <input className="case_name_input"
                      type="text"
                      name="case_name"
                      placeholder="사건명"
                      value={this.state.case_name}
                      onChange={this.handleValueChange}
                    />
                  </div>
                  <div className="flex-container-first-box">
                    <span className="case_description"> 한줄요약:{" "}</span>
                    <input className="case_description_input"
                      type="text"
                      name="description"
                      placeholder="한줄요약"
                      value={this.state.description}
                      onChange={this.handleValueChange}
                    />
                  </div>                  
                  <button className="case_button" onClick={() => {
                      this.setState({
                        isModalOpen: false,
                        cases: undefined,
                      });
                    }}
                  >
                    <span className="case_button_text">등록</span>
                  </button>
                </form>
                
                </div>
              </Modal>
              {console.log(this.state.isModalOpen)}
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: "center" }}>번호</TableCell>
                <TableCell style={{ textAlign: "center" }}>케이스명</TableCell>
                <TableCell style={{ textAlign: "center" }}>설명</TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ textAlign: "center" }}>
              {console.log(typeof this.state.cases)}
              {this.state.cases ? (
                this.state.cases.map((c, i) => {
                  return (
                    <Case
                      key={this.state.maxNo + i}
                      id={this.state.maxNo + i}
                      name={c.CaseName}
                      description={c.Description}
                      idx={c.index}
                    />
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan="6" align="center">
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

export default CasePage;
