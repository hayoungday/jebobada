import React, { Component, useState, useRef, useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Box from "@material-ui/core/Box";
import TextField from "@mui/material/TextField";
import "./Agree.css";
import "./Home.css";
import ViewArtifact_checkedFalse from "./ViewArtifact_checkedFalse";
import ViewArtifact_checkedTrue from "./ViewArtifact_checkedTrue";
import TypeChooser from "./TypeChooser";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import "./UploadEvidence_artifact.css";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/src/styles/index.css";
import MuiAlert from "@mui/material/Alert";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

const modal_style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "35%",
  height: "40%",
  bgcolor: "background.paper",
  textAlign: "center",
  boxShadow: 10,
  borderRadius: "18px",
  p: 4,
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

let keyword = "";

class Editevidence_artifact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileVerify: true,
      isSnackbarOpen: false,
      isDetail: false,
      user: "",
      file: null,
      fileName: "",
      isListOpen: true,
      originalArtifact: [],
      artifactList: this.props.location.state.artifact_checked_list,
      _id:this.props.location.state.object_id["$oid"],
      attacker: this.props.location.state.attacker,
      description: this.props.location.state.desc,
      id: "",
      value: "1",
      type: this.props.location.state.bullying,
      keyword: "",
      keyword_input: "",
      startTime: "0000-00-00T00:00",
      endTime: "9999-99-99T99:99",
      startTime_input: "0000-00-00T00:00",
      endTime_input: "9999-99-99T99:99",
      isModalOpen: false,
      work_startTime: "00:00",
      work_endTime: "99:99",
      work_startTime_input: "00:00",
      work_endTime_input: "99:99",
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.getData = this.getData.bind(this);
    this.submitButton = this.submitButton.bind(this);
    this.setAttacker = this.setAttacker.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.getType = this.getType.bind(this);
    this.UserChooserOpen = this.UserChooserOpen.bind(this);
    this.checkedListOpen = this.checkedListOpen.bind(this);
    this.go = this.go.bind(this);
    // this.typographyOpen = this.typographyOpen.bind(this);
    this.modalOpen = this.modalOpen.bind(this);
    this.modalClose = this.modalClose.bind(this);
    this.snackbarOpen = this.snackbarOpen.bind(this);
    this.snackbarClose = this.snackbarClose.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.progress, 20);
  }
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  go() {
    this.props.history.goBack();
  }

  async callApi() {
    let body = {
      user: this.props.location.state.user,
      casenum: "0",
    };
    if (keyword) {
      let res = axios.get(
        "/getevidences?keyword=" +
          keyword +
          "&casenum=" +
          this.props.location.state.casenum
      );

      return res;
    } else {
      return axios.post("/getevidences", body);
    }
  }


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
    console.log(e.target.files[0].name);
    this.setState({
      file: e.target.files[0],
      fileName: e.target.files[0].name,
    });
  }


  

  handleSwitchClick = (event) => {
    console.log(event.target.checked);
    this.setState({ isDetail: event.target.checked });
  };

  snackbarOpen() {
    this.setState({ isSnackbarOpen: true });
  }

  snackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ isSnackbarOpen: false });
  };

  modalOpen() {
    this.setState({ isModalOpen: true });
  }

  modalClose() {
    this.setState({ isModalOpen: false });
  }

  getworkStartTime = (event) => {
    if (event.target.value) {
      this.setState({ work_startTime: event.target.value });
    } else {
      this.setState({ work_endTime: "00:00" });
    }
  };

  getworkEndTime = (event) => {
    if (event.target.value) {
      this.setState({ work_endTime: event.target.value });
    } else {
      this.setState({ work_endTime: "00:00" });
    }
  };

  getStartTime = (event) => {
    console.log(event.target.value);
    if (event.target.value) {
      this.setState({ startTime: event.target.value });
    } else {
      this.setState({ startTime: "0000-00-00T00:00" });
    }
  };

  getEndTime = (event) => {
    console.log(event.target.value);
    if (event.target.value) {
      this.setState({ endTime: event.target.value });
    } else {
      this.setState({ endTime: "9999-99-99T99:99" });
    }
  };

  getData(data) {
    this.setState({ artifactList: data });
    // console.log(data);
  }

  getType(type) {
    console.log(type);
    this.setState({ type: type });
    if (type === "초과근무") {
      this.setState({ isModalOpen: true });
    }
  }
  UserChooserOpen() {
    if (this.state.isListOpen && this.state.fileVerify) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ flex: "2",textAlign:"center"}}>
            <div><Typography variant="h6" style={{fontFamily:"NanumSquare-Regular",color:"#4B64D4"}}>전체 보기</Typography></div>
            <div>
              <Switch
                checked={this.state.isDetail}
                onChange={this.handleSwitchClick}
              />
            </div>
          </div>
          <div style={{ flex: "6" }}>
            <TypeChooser getType={this.getType} defaultType={this.props.location.state.bullying}/>
          </div>
          <div style={{ flex: "1"}}>
            <TextField
              id="datetime-local"
              label="start time"
              type="datetime-local"
              defaultValue=""
              sx={{ width: 250 }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => this.getStartTime(event)}
            />
          </div>
          <div style={{marginLeft:"0.5%",marginRight:"0.5%"}}>
          <Typography variant="h5" style={{color:"#4B64D4"}}>~</Typography>
          </div>
          <div style={{ flex: "1", marginRight: "1%" }}>
            <TextField
              id="datetime-local"
              label="end time"
              type="datetime-local"
              sx={{ width: 250 }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => this.getEndTime(event)}
            />
          </div>
          <div style={{ flex: "4" }}>
            <TextField
              fullWidth
              id="filled-search"
              label="검색"
              type="search"
              variant="filled"
              onChange={this.setKeyword}
              size="large"
            />
          </div>
          <div style={{ flex: "0.5", textAlign: "center" }}>
            <Button
              onClick={() => {
                this.setState({
                  startTime_input: this.state.startTime,
                  endTime_input: this.state.endTime,
                  keyword_input: this.state.keyword,
                });
              }}
            >
              <SearchIcon color="primary" fontSize="large"></SearchIcon>
            </Button>
          </div>
          <br></br>

          <br></br>
        </div>
      );
    }
  }

  // typographyOpen() {
  //   if (this.state.isListOpen && this.state.fileVerify) {
  //     return (

  //     );
  //   }
  // }

  listOpen() {
    if (this.state.isListOpen && this.state.fileVerify) {
      return (
        <div>
          <div style={{ transition: "all.5s ease" }}>
            <Modal
              style={{ transition: "all.5s ease" }}
              open={this.state.isModalOpen}
              onClose={this.modalClose}
            >
              <div>
                <Box sx={modal_style}>
                  <Typography
                    style={{
                      color: "#4B64D4",
                      fontFamily: "NanumSquare-Regular",
                      fontWeight: "bold",
                    }}
                    variant="h4"
                  >
                    근무 시간 선택
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ mt: 2 }}
                    style={{ fontFamily: "NotoSansKR-Light", color: "#3F3F3F" }}
                  >
                    정규 근무 시간을 선택해주세요
                  </Typography>

                  <br></br>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ marginRight: "9%" }}>
                      <Typography
                        style={{
                          color: "#4B64D4",
                          fontFamily: "NanumSquare-Regular",
                          fontWeight: "bold",
                        }}
                        variant="h6"
                      >
                        시작시간
                      </Typography>
                    </div>
                    <div style={{ marginLeft: "9%" }}>
                      <Typography
                        style={{
                          color: "#4B64D4",
                          fontFamily: "NanumSquare-Regular",
                          fontWeight: "bold",
                        }}
                        variant="h6"
                      >
                        종료시간
                      </Typography>
                    </div>
                  </div>
                  <div style={{ lineHeight: "65%" }}>
                    <br></br>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ marginRight: "8%" }}>
                      <TextField
                        type="time"
                        defaultValue="00:00"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(event) => this.getworkStartTime(event)}
                      />
                    </div>
                    <div>
                      <TextField
                        type="time"
                        defaultValue="00:00"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(event) => this.getworkEndTime(event)}
                      />
                    </div>
                  </div>
                  <div style={{ lineHeight: "65%" }}>
                    <br></br>
                  </div>
                  <br></br>
                  <div style={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      style={{ marginRight: "5%" }}
                      onClick={() => {
                        this.modalClose();
                        this.setState({
                          work_startTime_input: this.state.work_startTime,
                          work_endTime_input: this.state.work_endTime,
                        });
                      }}
                    >
                      <Typography variant="h7">확인</Typography>
                    </Button>
                    <Button
                      onClick={() => {
                        this.modalClose();
                        this.setState({
                          work_startTime_input: "00:00",
                          work_endTime_input: "99:99",
                        });
                      }}
                    >
                      <Typography variant="h7">취소</Typography>
                    </Button>
                  </div>
                </Box>
              </div>
            </Modal>
          </div>

          <div>
            <ViewArtifact_checkedFalse
              startTime={this.state.startTime_input}
              endTime={this.state.endTime_input}
              data={this.state.artifactList}
              id={this.state.id}
              getData={this.getData}
              type={this.state.type}
              keyword={this.state.keyword_input}
              work_startTime={this.state.work_startTime_input}
              work_endTime={this.state.work_endTime_input}
              isDetail={this.state.isDetail}
            />
          </div>
        </div>
      );
    }
  }
  checkedListOpen() {
    if (this.state.isListOpen && this.state.fileVerify) {
      return (
        <div>
          <ViewArtifact_checkedTrue
            data={this.state.artifactList}
            id={this.state.id}
            getData={this.getData}
            type={this.state.type}
          />
        </div>
      );
    }
  }

  userInputOpen() {
    if (this.state.isListOpen && this.state.fileVerify) {
      return (
        <div>
          <br></br>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1 },
              width: "70%",
              marginLeft: "3%",
            }}
            noValidate
            autoComplete="off"
          >
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              style={{
                color: "#4B64D4",
                fontFamily: "NanumSquare-Regular",
                fontWeight: "bolder",
                marginLeft: "1.5%",
              }}
            >
              행위자*
            </Typography>
            <ReactTagInput
              tags={this.state.attacker}
              placeholder="행위자를 입력하고 Enter를 누르세요"
              maxTags={10}
              editable={true}
              readOnly={false}
              removeOnBackspace={true}
              onChange={(newTags) => this.setState({ attacker: newTags })}
            />
          </Box>

          <br></br>

          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1 },
              width: "92%",
              marginLeft: "3%",
            }}
            noValidate
            autoComplete="off"
          >
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              style={{
                color: "#4B64D4",
                fontFamily: "NanumSquare-Regular",
                fontWeight: "bolder",
                marginLeft: "1%",
              }}
            >
              상세설명
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              onChange={this.setDescription}
              defaultValue={this.props.location.state.desc}
            />
          </Box>
          <br></br>
        </div>
      );
    }
  }

  setKeyword = (e) => {
    console.log(e.target.value);
    this.setState({
      keyword: e.target.value,
    });
  };

  setAttacker = (e) => {
    this.setState({
      attacker: e.target.value,
    });
  };

  setDescription = (e) => {
    console.log(this.state.description)
    this.setState({
      description: e.target.value,
    });
  };

  submitButton = () => {
    if (this.state.attacker.length == 0) {
      return alert("행위자는 필수 입력 사항입니다!");
    }
    this.setState({ isSnackbarOpen: true });
    let body = {
      _id:this.state._id,
      isCheckedUpdate: this.state.artifactList,
      desc:this.state.description,
      attacker:this.state.attacker,
      type:this.state.type,
      filename:this.props.location.state.filename
    };
    axios.post("/evidenceupdate_artifact", body);
    alert("수정이 완료되었습니다.")
    this.props.history.goBack();
  };

  searchClick = (e) => {
    this.setState({
      searchKeyword: e.target.value,
    });
    console.log(e.target.value);
  };

  render() {
    console.log(this.state.attacker);
    return (
      <div style={{ backgroundColor: "#F0F0F4" }}>
        <Header />
        <br></br>
        <br></br>
        <br></br>
        <div style={{ width: "80%", margin: "0 auto", marginTop: "3%" }}>
          <Typography
            variant="h4"
            gutterBottom
            component="div"
            style={{
              color: "#3F3F3F",
              fontFamily: "NanumSquare-Regular",
              fontWeight: "bolder",
              marginLeft: "2%",
            }}
          >
            {this.props.location.state.filename}
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            component="div"
            style={{
              color: "#3F3F3F",
              fontFamily: "NotoSansKR-Light",
              marginLeft: "1%",
            }}
          >
            선택했던 컴퓨터 사용 기록 항목을 수정할 수 있습니다.
          </Typography>
        </div>
        <div style={{ width: "80%", margin: "0 auto" }}>
          
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "18px",
              boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
              // display: "flex",
              // flexDirection: "column",
              // textAlign: "center",
            }}
          >
            {this.state.isListOpen?<br></br>:null}            
            {this.UserChooserOpen()}
            {this.state.isListOpen?<br></br>:null}  
            
          </div>
          <br></br>
          <div
            style={{
              height: "auto",
              maxHeight: "800px",
              overflowY: "auto",
              // overflowX: "hidden",
              overflowX: "auto",
              boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
              borderRadius: "18px",
            }}
          >
            {this.listOpen()}
          </div>
          <br></br>
          <br></br>
          {this.state.isListOpen ? (
            <Typography
              variant="h4"
              gutterBottom
              component="div"
              style={{
                color: "#3F3F3F",
                fontFamily: "NanumSquare-Regular",
                fontWeight: "bolder",
                marginLeft: "2%",
              }}
            >
              선택한 항목을 아래에서 확인할 수 있습니다
            </Typography>
          ) : null}
          {this.state.isListOpen ? (
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "18px",
                boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              {this.checkedListOpen()}
            </div>
          ) : null}

          <br></br>
          <br></br>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "18px",
              boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            }}
          >
            {this.userInputOpen()}
          </div>
          {this.state.isListOpen ? (
            <div>
              <br></br>
              <Button
                onClick={() => {
                  this.submitButton();
                }}
                variant="contained"
              >
                <Typography variant="h6" display="block" gutterBottom>
                  수정
                </Typography>
              </Button>
              

              <Button
                variant="text"
                style={{ float: "right" }}
                onClick={() => {
                  this.go();
                }}
              >
                <Typography variant="h6" display="block" gutterBottom>
                  &lt; 되돌아가기
                </Typography>
              </Button>
              <br></br>
              <br></br>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Editevidence_artifact;
