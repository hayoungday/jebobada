import React, { Component, useState } from "react";
import Header from "./Header";
import axios from "axios";
import Case from "./Case";
import {Link} from 'react-router-dom';
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import CircularProgress from "@material-ui/core/CircularProgress";
import { InputBase } from "@material-ui/core";
import SearchBox from "./SearchBox";
import Modal from "./Modal";
import Typography from "@mui/material/Typography";
import FadeIn from 'react-fade-in';
import CaseEditModal from './CaseEdit_Modal'

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
      isCaseEditModalOpen: false,
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.addCase = this.addCase.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleDeleteButton=this.handleDeleteButton.bind(this);
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

  openCaseEditModal=()=>{
    this.setState({isCaseEditModalOpen:true})
  }

  closeCaseEditModal=()=>{
    this.setState({isCaseEditModalOpen:false})
  }

  handleDeleteButton=(case_name,user,idx)=>{
    var message =
      "정말로 삭제하시겠습니까?\n사건 내에 저장되어 있는 모든 증거가 삭제됩니다.";

    const result = window.confirm(message);

    if (result) {
      console.log("button clicked!!!!");

      let body = {
        case_name: case_name,
        user: user,
        casenum: idx
      };
      return axios.post("/deletecase", body);
    } else {
      console.log("취소되었습니다.");
    }
  };

  render() {
    return (
      <div>
        <Header />
        <div className="wrap">
          <div className="flex-column-container">
            <div className="flex-container-case-box">
              <div className="flex-column-content-container">
                <span className="select-case-text">
                  <span className="text_color">폴더</span>를 생성하여 괴롭힘 관련 자료를 <span className="text_color">관리</span>하세요
                </span>
                <span className="select-case-content">
                  폴더 하나 당 하나의 신고 보고서를 생성할 수 있습니다.
                  <p />
                  폴더에 직장 내 괴롭힘 신고를 위한 증거 자료를 모아 관리하세요.
                </span>
              </div>
              <button className="add-case-button" onClick={this.openModal}>
                새로 만들기
              </button>
              <Modal visible={this.state.isModalOpen}>
                <button
                  className="close_button"
                  onClick={() => {
                    this.setState({ isModalOpen: false });
                  }}
                >
                  <img
                    class="close_button_img"
                    src="./static/react/close_icon.png"
                  />
                </button>
                <div className="flex-column-container-case">
                  <span className="modal_title">폴더 생성</span>
                  <form onSubmit={this.handleFormSubmit}>
                    <div className="flex-container-first-box">
                      <span className="case_name"> 폴더명: </span>
                      <input
                        className="case_name_input"
                        type="text"
                        name="case_name"
                        placeholder="폴더명"
                        value={this.state.case_name}
                        onChange={this.handleValueChange}
                      />
                    </div>
                    <div className="flex-container-first-box">
                      <span className="case_description"> 설명: </span>
                      <input
                        className="case_description_input"
                        type="text"
                        name="description"
                        placeholder="설명"
                        value={this.state.description}
                        onChange={this.handleValueChange}
                      />
                    </div>
                    <button
                      className="case_button"
                      onClick={() => {
                        this.setState({
                          isModalOpen: false,
                          cases: undefined,
                        });
                      }}
                    >
                      {" "}
                      등록
                    </button>
                  </form>
                </div>
              </Modal>
              {console.log(this.state.isModalOpen)}
            </div>
            {/* <div className="table_style">
              <Table
                style={{
                  tableLayout: "fixed",
                  wordBreak: "break-all",
                  wordWrap: "break-word",
                }}
              >
                <colgroup>
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "30%" }} />
                  <col style={{ width: "40%" }} />
                  <col style={{ width: "20%" }} />
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
                        케이스명
                      </Typography>
                    </TableCell>
                    <TableCell className="table_cell">
                      <Typography variant="h6" className="table_head_typo">
                        설명
                      </Typography>
                    </TableCell>
                    <TableCell className="table_cell_right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {console.log(typeof this.state.cases)}
                  {this.state.cases ? (
                    this.state.cases.map((c, i) => {
                      return (
                        <Case
                          key={this.state.maxNo + i}
                          id={this.state.maxNo + i}
                          name={c.CaseName}
                          description={c.Description}
                          user={c.User}
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
            </div> */}

            {/* ==========    여기 아래는 그냥 테스트중     ============= */}
            <div>
              <FadeIn>
                {this.state.cases ? (
                  this.state.cases.map((c, i) => {
                    return (
                      <div className="casepage_test_case_box">
                        <button className="casepage_test_case_box_title">
                          <Link
                            to={{
                              pathname: "/upload/" + c.index,
                              state: { casename: c.CaseName },
                            }}
                          >
                            {c.CaseName}
                          </Link>
                        </button>
                        <div className="casepage_test_case_box_desc">{c.Description}</div>
                        <div className="flex-container-evidence">
                          <div className="button_edit">
                            <button
                              onClick={this.openCaseEditModal}
                              className="button_text"
                            >
                              수정
                            </button>
                          </div>
                          <CaseEditModal
                            visible={this.state.isCaseEditModalOpen}
                            case_name={c.CaseName}
                            user={c.User}
                            closeModal={this.closeCaseEditModal}
                            desc={c.Description}
                          ></CaseEditModal>
                          <div className="button_edit">
                            <button
                              onClick={()=>this.handleDeleteButton(c.CaseName,c.User,c.index)}
                              className="button_text"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="circular_progress">
                    <CircularProgress variant="indeterminate" />
                  </div>
                )}
              </FadeIn>
            </div>
            <br></br>
          </div>
        </div>
      </div>
    );
  }
}

export default CasePage;
