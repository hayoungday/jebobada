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
import "@pathofdev/react-tag-input/build/index.css";
import MuiAlert from "@mui/material/Alert";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

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

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileVerify:false,
      isSnackbarOpen: false,
      isDetail:false,
      user: "",
      file: null,
      fileName: "",
      isListOpen: false,
      originalArtifact: [],
      artifactList: [],
      attacker: [],
      description: "",
      id: "",
      value: "1",
      type: "",
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
    this.loadData = this.loadData.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.addEvidence = this.addEvidence.bind(this);
    this.getData = this.getData.bind(this);
    this.submitButton = this.submitButton.bind(this);
    this.setAttacker = this.setAttacker.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.getType = this.getType.bind(this);
    this.UserChooserOpen = this.UserChooserOpen.bind(this);
    this.checkedListOpen = this.checkedListOpen.bind(this);
    this.go = this.go.bind(this);
    this.typographyOpen = this.typographyOpen.bind(this);
    this.modalOpen = this.modalOpen.bind(this);
    this.modalClose = this.modalClose.bind(this);
    this.snackbarOpen = this.snackbarOpen.bind(this);
    this.snackbarClose = this.snackbarClose.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.progress, 20);
    this.intervalId = setInterval(() => this.loadData(), 3000);
    this.loadData();
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

  async loadData() {
    const res = await axios.get("/getuser");
    this.state.user = res.data.user;

    this.callApi()
      .then((res) => {
        this.setState({ boards: res.data });
      })
      .catch((err) => console.log(err));
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

  addEvidence() {
    const formData = new FormData();
    formData.append("file", this.state.file);
    formData.append("filename", this.state.fileName);
    formData.append("user", this.state.user);
    formData.append("case_num", this.props.location.state.casenum);
    const config = {
      headers: {
        enctype: "multipart/form-data",
      },
    };
    axios.post("/loadArtifactFile", formData, config).then((res) => {
      if(res.data.res=="verified fail"){
        alert("임의로 편집된 파일은 업로드가 불가능합니다. 원본 파일을 업로드 해 주세요.")
      }
      else{
        this.setState({fileVerify:true})
      }
      console.log(res.data.data);
      
      this.setState({ artifactList: res.data.data });
      this.setState({ originalArtifact: res.data.data });
      // this.setState({ artifactList: res.data.data });
      // this.setState({ id: res.data._id.$oid });
    });
  }

  async callUserApi() {
    try {
      const res = await axios.get("/getuser");
      this.state.user = res.data.user;

      this.addEvidence();
    } catch (err) {
      return console.log(err);
    }
  }

  handleSwitchClick=(event)=>{
    console.log(event.target.checked)
    this.setState({isDetail:event.target.checked})
  }

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
    console.log(data);
  }

  getType(type) {
    console.log(type);
    this.setState({ type: type });
    if (type === "초과근무") {
      this.setState({ isModalOpen: true });
    }
  }
  UserChooserOpen() {
    if (this.state.isListOpen&&this.state.fileVerify) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ flex: "6", marginRight: "3%" }}>
            <TypeChooser getType={this.getType} />
          </div>
          <div style={{ flex: "2" }}>
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
          <div style={{ flex: "2" }}>
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
          <div style={{ flex: "2" }}>
            <TextField
              id="filled-search"
              label="검색"
              type="search"
              variant="filled"
              onChange={this.setKeyword}
            />
          </div>
          <div style={{ flex: "1", textAlign: "center" }}>
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
        </div>
      );
    }
  }

  typographyOpen() {
    if (this.state.isListOpen&&this.state.fileVerify) {
      return (
        <Typography variant="h4" gutterBottom component="div">
          선택한 항목을 아래에서 확인할 수 있습니다
        </Typography>
      );
    }
  }

  listOpen() {
    if (this.state.isListOpen&&this.state.fileVerify) {
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
                    style={{ color: "#5C7BDE", fontWeight: "bold" }}
                    variant="h4"
                  >
                    근무 시간 선택
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 2 }}>
                    정규 근무 시간을 선택해주세요
                  </Typography>

                  <br></br>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ marginRight: "9%" }}>
                      <Typography
                        style={{ color: "#5C7BDE", fontWeight: "bold" }}
                        variant="h6"
                      >
                        시작시간
                      </Typography>
                    </div>
                    <div style={{ marginLeft: "9%" }}>
                      <Typography
                        style={{ color: "#5C7BDE", fontWeight: "bold" }}
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
          <div style={{  marginRight: "50px" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.isDetail}
                  onChange={this.handleSwitchClick}
                />
              }
              label="전체 보기"
            />
          </div>
          <div >
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
    if (this.state.isListOpen&&this.state.fileVerify) {
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
    if (this.state.isListOpen&&this.state.fileVerify) {
      return (
        <div>
          <br></br>
          <br></br>
          <br></br>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
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
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              fullWidth
              id="outlined-multiline-static"
              label="상세설명"
              multiline
              rows={8}
              variant="outlined"
              onChange={this.setDescription}
              helperText="피해 사실에 대한 상세한 설명을 적어주세요"
            />
          </Box>
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
    this.setState({
      description: e.target.value,
    });
  };

  submitButton = () => {
    const formData = new FormData();
    formData.append("file", this.state.file);
    formData.append("filename", this.state.fileName);
    formData.append("user", this.state.user);
    formData.append("case_num", this.props.location.state.casenum);
    const config = {
      headers: {
        enctype: "multipart/form-data",
      },
    };
    axios.post("/loadArtifactFile", formData, config).then((res) => {
      this.setState({ artifactList: res.data.data });
    });
    
    this.setState({ attacker: [] });
    this.setState({ description: "" });
    this.setState({ type: "" });

    if (this.state.attacker.length==0) {
      return alert("행위자는 필수 입력 사항입니다!");
    }
    this.setState({isSnackbarOpen:true});
    let body = {
      filetype: "컴퓨터 증거",
      isCheckedUpdate: this.state.artifactList,
      attacker: this.state.attacker,
      description: this.state.description,
      type: this.state.type,
      casenum: this.props.location.state.casenum,
      user: this.state.user,
      filename: this.state.fileName,
    };
    const res = axios.post("/isCheckedUpdate", body);
    console.log(res);
    this.setState({});
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
      <div>
          {/* <Header /> */}
        <div style={{ width: "85%", margin: "0 auto" }}>
          <div>
            <br></br>
            <br></br>
            <form onSubmit={this.handleFormSubmit}>
              <form onSubmit={this.handleFormSubmit}>
                <input
                  style={{ flex: "1" }}
                  type="file"
                  name="file"
                  file={this.state.file}
                  onChange={this.handleFileChange}
                />
              </form>
              <button
                class="btn btn-primary"
                onClick={() => {
                  this.setState({
                    isListOpen: true,
                  });
                }}
              >
                등록
              </button>
            </form>
            <br></br>
          </div>
          {this.UserChooserOpen()}
          <br></br>
          <div
            style={{
              height: "auto",
              maxHeight: "800px",
              overflowY: "auto",
              // overflowX: "hidden",
              overflowX: "auto",
              boxShadow:
                "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.63)",
              borderRadius:"30px"
            }}
          >
            {this.listOpen()}
          </div>
          <br></br>
          <br></br>
          <div>{this.typographyOpen()}</div>
          <br></br>
          <br></br>
          <div
            style={{
              height: "auto",
              maxHeight: "800px",
              overflowY: "auto",
              // overflowX: "hidden",
              overflowX: "auto",
              boxShadow:
                "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.63)",
            }}
          >
            {this.checkedListOpen()}
          </div>
          <div>{this.userInputOpen()}</div>
          <div>
            <br></br>
            <Button onClick={()=>{this.submitButton()}}variant="contained">
              <Typography variant="h6" display="block" gutterBottom>
                확인
              </Typography>
            </Button>
            <Snackbar
              open={this.state.isSnackbarOpen}
              autoHideDuration={6000}
              onClose={() => {
                this.snackbarClose();
              }}
            >
              <Alert
                onClose={() => {
                  this.snackbarClose();
                }}
                severity="success"
                sx={{ width: "200%" }}
              >
                완료되었습니다!
              </Alert>
            </Snackbar>
            
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
        </div>
      </div>
    );
  }
}

export default Upload;
