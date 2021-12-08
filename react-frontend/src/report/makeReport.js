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
import "../components/mainpage.css"
import FadeIn from 'react-fade-in';
import {Link} from 'react-router-dom';



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
      isModalOpen: false,
      createtime: "-",
      isCreated: false,
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

  CreateButtonClicked =()=> {
    let today = new Date();
    let month = today.getMonth() + 1
    let today_date = today.getFullYear() + "." + month + "." + today.getDate() + "."
    this.setState({createtime:today_date})
    this.setState({isCreated:true})
}

  CreateButton=()=>{
      return(
          <button onClick = {this.CreateButtonClicked} style={{border:'none'}}>
              <img src='./static/react/group94.png' style={{ width: '80px' }}/>
          </button>
      )
  }

  ShowButton=()=>{
      return(
          <Link to={{pathname:'/mainbullying',state:{case_id:this.props._id}}} style={{textDecoration:'none'}}>
              <button style={{border:'none'}}>
                  <img src='./static/react/group9100.png' style={{ width: '80px' }}/>
              </button>
          </Link>
      )
  }

  // Updatebutton=()=>{
  //     return(
  //         <button style={{border:'none'}}>
  //             <img src='./static/react/update.png' style={{ width: '20px'}}/>
  //         </button>
  //     )
  // }


  render() {

    // let report_button
    // let update_button = this.Updatebutton()

    // if (this.state.isCreated == true) {
    //     report_button = this.ShowButton()
    // } else {
    //     report_button = this.CreateButton()
    // }

    return (
      <div>
        <Header />
        <div className="wrap">
          <div className="jb_banner_report">
            <div className="jb-case-flex-container">
              <div className="jb-case-flex-column-container">
                <span className="jb_case_banner_title">
                  보고서를 생성할 사건 폴더를 선택하세요
                </span>
                <span className="jb_case_banner_subtitle">
                보고서 생성 버튼을 누르면 사건 폴더에 모은 증거자료와 관련된 보고서가 생성됩니다.<br/>
                보고서를 재생성하고 싶다면 업데이트 아이콘을 클릭하세요. 업데이트를 누르면 변경된 증거자료가 새로 반영 됩니다.<br/>
                </span>
              </div>
            </div>
          </div>
          
          <FadeIn>
            <div className="jb-case-card-flex-container">
                {this.state.cases ? (
                  this.state.cases.map((c, i) => {
                    let report_button
                    
                    if (this.state.isCreated == true) {
                        report_button = this.ShowButton()
                    } else {
                        report_button = this.CreateButton()
                    }
                    return (
                      <ReportTable
                        key={this.state.maxNo + i}
                        id={this.state.maxNo + i}
                        name={c.CaseName}
                        description={c.Description}
                        user = {c.User}
                        idx={c.index}
                        _id={c._id.$oid}
                      />
                      // <div className="casepage_test_case_box">
                      //   {/* <Link
                      //       to={{
                      //         pathname: "/upload/" + c.index,
                      //         state: { casename: c.CaseName },
                      //       }}
                      //     > */}
                      //   <div className="casepage_test_case_box_title">
                      //     {c.CaseName}
                      //   </div>
                      //   {/* </Link> */}
                        
                      //   <span className="casepage_test_case_box_desc">{c.Description}</span>
                      //   <div className="jb-case-item-flex-container">
                      //     <div className="jb-rp-items">{this.state.createtime}</div>
                      //     <div className="jb-rp-items">{report_button}</div>


                            // {/* <button
                            //   onClick={()=>this.handleDeleteButton(c.CaseName,c.User,c.index)}
                            //   className="case_del_button"
                            // />

                            // <button
                            //   onClick={this.openCaseEditModal}
                            //   className="case_edit_button"
                            // /> */}

                            // {/* <CaseEditModal
                            //   visible={this.state.isCaseEditModalOpen}
                            //   case_name={c.CaseName}
                            //   user={c.User}
                            //   closeModal={this.closeCaseEditModal}
                            //   desc={c.Description}
                            // />                              */}
                        // </div>
                      // </div>
                    );
                  })
                ) : (
                  <div className="circular_progress">
                    <CircularProgress variant="indeterminate" />
                  </div>
                )}
              </div>
              </FadeIn>



        {/* <div className="flex-column-container">
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
                      _id={c._id.$oid}
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
        </div>
      </div>

    );
  }
}

export default makeReport;
