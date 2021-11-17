import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {Link} from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios'

// import CustomerDelete from './CustomerDelete';

class Evidence extends React.Component {
    callApi = async() => {
        const response = await fetch('/getuser')
        const body = await response.json();
        console.log(body)
        return body
    }
    render() {

        const handleDeleteButton=()=>{
            var message = "해당 증거를 정말로 삭제하시겠습니까?"
            
            const result = window.confirm(message)

            if(result){
                let body = {
                    casenum: this.props.casenum,
                    user: this.props.user_id,
                    filename: this.props.name
                }
                return axios.post("/deleteevidence",body)
            } else{
                console.log("취소되었습니다.")
            }
            
        }
       


        return (
          <TableRow style={{ textAlign: "center" }}>
            <TableCell style={{ textAlign: "center" }}>
              {this.props.id}
            </TableCell>
            {/* <TableCell><img src={this.props.image} alt="profile"/></TableCell> */}

            <TableCell style={{ textAlign: "center", wordBreak: "keep-all" }}>
              <Link
                to={{
                  pathname:
                    "/PostView/" +
                    this.props.casenum +
                    "/" +
                    this.props.idx +
                    "/" +
                    this.props.keyword,
                  state: {
                    bullying: this.props.bullying,
                    filename: this.props.filename,
                    desc: this.props.desc,
                    datetime: this.props.date,
                    location: this.props.location,
                    attacker: this.props.attacker,
                    object_id: this.props.object_id,
                  },
                }}
              >
                {this.props.name}
              </Link>
            </TableCell>

            <TableCell
              style={{
                textAlign: "center",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {this.props.desc}
            </TableCell>

            <TableCell style={{ textAlign: "center" }}>
              {this.props.bullying}
            </TableCell>

            <TableCell style={{ textAlign: "center" }}>
              {this.props.type}
            </TableCell>

            <TableCell style={{ textAlign: "center" }}>
              {this.props.date}
            </TableCell>

            <TableCell style={{ textAlign: "center" }}>
              {this.props.state === "등록완료" ? (
                <div>등록완료</div>
              ) : (
                <div>
                  <CircularProgress variant="indeterminate" value="변환중" />
                </div>
              )}
            </TableCell>

            <TableCell style={{ textAlign: "center" }}>
              <div className="flex-container-evidence">
                {this.props.type == "컴퓨터 증거" ? (
                  <Link
                    to={{
                      pathname: "/editevidence_artifact",
                      state: {
                        artifact_checked_list: this.props.data,
                        object_id: this.props.object_id,
                        attacker: this.props.attacker,
                        bullying: this.props.bullying,
                        desc: this.props.desc,
                        filename:this.props.name
                      },
                    }}
                    style={{ textDecoration: "none" }}
                    className="button_edit"
                  >
                    <button className="button_text">수정</button>
                  </Link>
                ) : (
                  <Link
                    to={{
                      pathname: "/editevidence",
                      state: {
                        casenum: this.props.casenum,
                        user: this.props.user_id,
                        filename: this.props.filename,
                        desc: this.props.desc,
                        bullying: this.props.bullying,
                        datetime: this.props.date,
                        attacker: this.props.attacker,
                        location: this.props.location,
                        index: this.props.idx,
                      },
                    }}
                    style={{ textDecoration: "none" }}
                    className="button_edit"
                  >
                    <button className="button_text">수정</button>
                  </Link>
                )}
                <div className="button_edit">
                  <button onClick={handleDeleteButton} className="button_text">
                    삭제
                  </button>
                </div>
              </div>
            </TableCell>
          </TableRow>
        );
    }
}

export default Evidence;