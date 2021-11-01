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
            console.log("button clicked!!!!")
    
            let body = {
                casenum: this.props.casenum,
                user: this.props.user_id,
                filename: this.props.name
            }
            return axios.post("/deleteevidence",body)
        }


        return (            
            <TableRow  style={{ textAlign: "center" }}>
                <TableCell style={{ textAlign: "center" }}>{this.props.id}</TableCell>
                {/* <TableCell><img src={this.props.image} alt="profile"/></TableCell> */}


                <TableCell style={{ textAlign: "center" }}>

                    <Link to = {{
                        pathname: '/PostView/'+this.props.casenum+'/'+this.props.idx+'/'+this.props.keyword,
                        state:{
                            bullying: this.props.bullying,
                            filename: this.props.filename,
                            desc : this.props.desc,
                            datetime: this.props.date,
                            location: this.props.location,
                            attacker: this.props.attacker,

                        }
                    }}>
                        {this.props.name}
                    </Link>
                </TableCell>

                <TableCell style={{textAlign: "center"}}>{this.props.desc}</TableCell>

                <TableCell style={{textAlign: "center"}}>{this.props.bullying}</TableCell>

                <TableCell style={{ textAlign: "center" }}>{this.props.type}</TableCell>

                <TableCell style={{ textAlign: "center" }}>{this.props.date}</TableCell>

                <TableCell style={{ textAlign: "center" }}>
                    {this.props.state==="변환완료"? <div>변환완료</div>:<div><CircularProgress variant="indeterminate" value="변환중"/></div>}        
                </TableCell>

                <TableCell style={{ textAlign: "center" }}>
                    <Link to = {{
                        pathname:'/editevidence',
                        state: {
                            casenum : this.props.casenum,
                            user: this.props.user_id,
                            filename: this.props.filename,
                            desc : this.props.desc,
                            bullying: this.props.bullying,
                            datetime: this.props.date,
                            attacker : this.props.attacker,
                            location : this.props.location,
                            index : this.props.idx,
                        }
                    }} style={{textDecoration:'none'}}>
                    <button>수정</button>
                    </Link>
                    
                    <button onClick={handleDeleteButton}>삭제</button>
                </TableCell>
            
            </TableRow>
        )
    }
}

export default Evidence;