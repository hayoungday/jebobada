import React, { useState } from "react";
import Header from "./Header";
import axios from "axios";

axios.defaults.withCredentials = true;

const Signup = ({ history }) => {
  const [userid, setId] = useState("");
  const [userpassword, setPassword] = useState("");
  const [userpassword2, setPassword2] = useState("");

  const onIdHandler = (event) => {
    setId(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onPasswordCheckHandler = (event) => {
    setPassword2(event.currentTarget.value);
  };

  /*signup.js*/

  const onSubmitHandler = (event) => {
    event.preventDefault();

    let body = {
      user_id: userid,
      user_pwd: userpassword,
      user_pwd2: userpassword2,
    };

    axios.post("/signup", body).then((res) => {
      if (res.data.result == "success") {
        alert("회원가입 완료");
        history.push("/login");
      } else if (res.data.result == "input_all") {
        alert("모두 다 기입해주세요");
      } else {
        alert("비밀번호를 다시 확인해주세요");
      }
    });
  };

  const onButtonClick = (event) => {
      event.preventDefault();

      let body = {
          user_id: userid
      }

      axios.post("/check_double", body).then((res)=> {
          if(res.data.result == "success"){
              console.log(res.data.result)
              alert("사용 가능한 ID 입니다.")
          }
          else if (res.data.result == "fail"){
              alert("이미 존재하는 ID 입니다.")
              console.log(res.data.result)
              setId("");
          }
      })
  }

  return (
    <div>
      <Header />
      <div class="container">
        <div class="row mt-5">
          <h1>회원가입</h1>
        </div>
        <div class="row mt-5">
          <div class="col-12">
            <form onSubmit={onSubmitHandler}>

                <div class="form-group">
                <label for="userid">아이디</label>
                <input
                    type="text"
                    class="form-control"
                    id="userid"
                    value={userid}
                    placeholder="아이디"
                    onChange={onIdHandler}
                />
                <button class="btn btn-primary" onClick={onButtonClick}>중복확인</button>
              </div>

              <div class="form-group">
                <label for="password">비밀번호</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  value={userpassword}
                  placeholder="비밀번호"
                  onChange={onPasswordHandler}
                />
              </div>

              <div class="form-group">
                <label for="re_password">비밀번호확인</label>
                <input
                  type="password"
                  class="form-control"
                  id="re_password"
                  value={userpassword2}
                  placeholder="비밀번호확인"
                  onChange={onPasswordCheckHandler}
                />
              </div>
              <button class="btn btn-primary">등록</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
