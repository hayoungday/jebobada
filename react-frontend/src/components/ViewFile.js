import React, { Component } from "react";
import Highlighter from "react-highlight-words";
import Edit_text_modal from "./Edit_text_modal";
import EasyEdit, { Types } from "react-easy-edit";
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';

class ViewFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      origin_text:this.props.text,
      isModalOpen: false,
      editText:"",
      binary:""
    };
  }

  componentDidMount(){
    let body={
      key:localStorage.getItem('key'),
      url:"https://craftguy.s3.ap-northeast-2.amazonaws.com/" +this.props.hashed_filename
    };
    axios.post("/load_s3_image",body).then((res)=>{
      this.setState({binary:res.data.res})
      console.log(res.data.res)
    })
  }
  updateDB=(editComplete)=>{
    let body={
      editData:editComplete,
      _id:this.props._id["$oid"]
    };
    const res=axios.post("/textEdit",body)
    console.log(res)
  }

  editText=(index,text)=>{
    let editComplete=this.state.origin_text
    console.log(index)
    console.log(text)
    editComplete[index].stt=text
    console.log(editComplete)
    this.setState({origin_text:editComplete})
    this.updateDB(editComplete)
    alert("수정이 완료되었습니다.");
  }

  cancel=()=>{
    alert("수정을 취소하였습니다.");
  };
  openModal = () => {
    this.setState({ isModalOpen: true });
  };
  render() {
    const listdata = this.state.origin_text.map((d) => (
      <p class="audio_contents_design_title" key={d.speaker}>
        <h5>화자{d.speaker}</h5>
        <Highlighter
          highlightStyle={{ backgroundColor: "yellow" }}
          searchWords={[this.props.keyword]}
          textToHighlight={d.stt}
        />
      </p>
    ));
    const src="data:audio/ogg;base64,"+this.state.binary
    
    return (
      <div class="component_design">
        {" "}
        <button onClick={this.openModal}>edit</button>
        <Edit_text_modal visible={this.state.isModalOpen}>
        <br></br>
          <h1>텍스트를 직접 수정할 수 있습니다.</h1>
          <br></br>
          <br></br>
          {this.props.text.map((d,index) => (
            <p>
              <h5>화자{d.speaker}</h5>
              <br></br>
              <div style={{width:"auto"}}>
              <EasyEdit
                type={Types.TEXTAREA}
                onSave={(value) => {this.editText(index,value)}}
                onCancel={this.cancel}
                saveButtonLabel="저장하기"
                cancelButtonLabel="취소"
                attributes={{ name: "awesome-input", id: 1 }}
                instructions="수정할 내용을 입력해 주세요"
                placeholder={d.stt}
                value={d.stt}
                
              ></EasyEdit>
              </div>
              <br></br>
            </p>            
          ))}
          
          <br></br>
          <br></br>
          <button
            onClick={() => {
              this.setState({ isModalOpen: false });
            }}
          >
            닫기
          </button>
        </Edit_text_modal>
        <br></br>
        <h1 class="audio_contents_design_title">{this.props.name}</h1>
        <br></br>
        {/* {console.log(this.state.origin_text)} */}
        <div className="audio_contents_design">
        {listdata}
        </div>
        {/* <audio controlsList="nodownload" controls>
          <source src={url} type="audio/mpeg" />
        </audio> */}
        
        {this.state.binary===""?(<CircularProgress variant="indeterminate" value="변환중" />):<audio controls src={src}/>}
        
      </div>
    );
  }
}

export default ViewFile;