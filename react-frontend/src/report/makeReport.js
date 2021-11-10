import React, { Component, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import ReportTable from "./reportTable";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import CircularProgress from "@material-ui/core/CircularProgress";
import "../components/Agree.css"

class makeReport extends Component {
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
        <div className="flex-column-container">
          <div className="flex-container-case-box">
            <div className="flex-column-content-container">
              <span className="select-case-text">
                보고서를 생성할 사건 폴더를 선택하세요
              </span>
              <span className="select-case-content">
                보고서 생성 버튼을 누르면 사건 폴더에 모은 증거자료와 관련된 보고서가 생성됩니다.
                <p />
                보고서를 재생성하고 싶다면 업데이트 아이콘을 클릭하세요. 업데이트를 누르면 변경된 증거자료가 새로 반영 됩니다. 
              </span>
            </div>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: "center" }}>번호</TableCell>
                <TableCell style={{ textAlign: "center" }}>사건</TableCell>
                <TableCell style={{ textAlign: "center" }}>생성일시</TableCell>
                <TableCell style={{ textAlign: "center" }}>생성/확인</TableCell>
                <TableCell style={{ textAlign: "center" }}>업데이트</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {console.log(typeof this.state.cases)}
              {this.state.cases ? (
                this.state.cases.map((c, i) => {
                  return (
                    <ReportTable
                      key={this.state.maxNo + i}
                      id={this.state.maxNo + i}
                      name={c.CaseName}
                      description={c.Description}
                      user = {c.User}
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

export default makeReport;
