import axios from "axios";
import React, { Component } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';

class ViewOCR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file_binary: "",
    };
  }

  componentDidMount(){
    let body = {
        url:
          "https://craftguy.s3.ap-northeast-2.amazonaws.com/" +
          this.props.hashed_filename,
        key: localStorage.getItem("key"),
      };
      axios.post("/load_s3_image", body).then((res) => {
        console.log(res.data.res);
        this.setState({ file_binary: res.data.res });
      });
  }

  render() {
    return (
      <div class='image_contents_design'>
          {this.state.file_binary===""?(<CircularProgress variant="indeterminate" value="변환중" />):<img class='image_contents_design' src={`data:image/png;base64,${this.state.file_binary}`} />}        
      </div>
    );
  }
}

export default ViewOCR;
