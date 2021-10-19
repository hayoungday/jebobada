import React,{useState} from 'react';
import Header from './Header';
import axios from 'axios';

axios.defaults.withCredentials = true;

const Signup = ({history}) => {
    const [userid, setId] = useState("")
    const [userpassword, setPassword] = useState("")
    const [userpassword2, setPassword2] = useState("")

    const onIdHandler = (event) => {
        setId(event.currentTarget.value)
    }
 
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    
    const onPasswordCheckHandler = (event) => {
        setPassword2(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();

        let body = {
            user_id: userid,
            user_pwd: userpassword,
            user_pwd2: userpassword2
        }

        axios
        .post("/signup",body)
        .then(res =>{
            if (res.data.result == 'success'){
                alert('회원가입 완료');
                history.push('/login')
            } else if (res.data.result == 'input_all') {
                alert("모두 다 기입해주세요");
            } else {
                alert("비밀번호를 다시 확인해주세요")
            }
        })

    }

    return(
        <div>
            <Header/>
            <div class = "container">
        <div class="row mt-5">
            <h1>회원가입</h1>
        </div>
        <div class="row mt-5">
        <div class="col-12">
            <form onSubmit={onSubmitHandler}>
                {/* <div class="form-group">
                    <label for="username">이름</label>
                    <input type="text" class="form-control" id = 'username' value={username} placeholder="사용자 이름" onChange={onNameHandler}/>
                </div> */}

                <div class="form-group">
                    <label for="userid">아이디</label>
                    <input type="text" class="form-control" id = 'userid' value={userid} placeholder="아이디" onChange={onIdHandler}/>
                    {/* <!-- id는 삭제해도 되더라. 마지막에 name과 app.py의 get 메소드 사용하는 부분이 일치해야 상응한다 --> */}
                </div>
                
                <div class="form-group">
                    <label for="password">비밀번호</label>
                    <input type="password" class="form-control" id='password' value={userpassword} placeholder="비밀번호" onChange={onPasswordHandler}/>
                </div>

                <div class="form-group">
                    <label for="re_password">비밀번호확인</label>
                    <input type="password" class="form-control" id='re_password' value={userpassword2} placeholder="비밀번호확인" onChange={onPasswordCheckHandler}/>
                </div>
                <button class="btn btn-primary">등록</button>
            </form>
        </div>
        </div>
        </div>
        </div>
    )
}

export default Signup;