import React, { Component, useState } from "react";
import Header from "./Header";
import axios from "axios";
import Case from "./Case";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
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
      <div>
        <Header />
        <div className="wrap">
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
                사건 추가
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
                  <span className="modal_title">사건 정보를 작성해주세요</span>
                  <form onSubmit={this.handleFormSubmit}>
                    <div className="flex-container-first-box">
                      <span className="case_name"> 사건명: </span>
                      <input
                        className="case_name_input"
                        type="text"
                        name="case_name"
                        placeholder="사건명"
                        value={this.state.case_name}
                        onChange={this.handleValueChange}
                      />
                    </div>
                    <div className="flex-container-first-box">
                      <span className="case_description"> 한줄요약: </span>
                      <input
                        className="case_description_input"
                        type="text"
                        name="description"
                        placeholder="한줄요약"
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
            <div className="table_style">
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
            </div>
            
 {/* ==========    여기 아래는 그냥 테스트중     ============= */}
            <FadeIn>
              <br></br>
              <br></br>
              <div className="casepage_test_case_box">
                사건1
              </div>
              <div className="casepage_test_case_box">
                사건2
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    );
  }
}

export default CasePage;
