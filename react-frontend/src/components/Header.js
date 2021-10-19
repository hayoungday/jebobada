import React, { useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Cookies } from "react-cookie";

import Access_log from "./Access_log";
import Access_log_modal from "./Access_log_modal";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import CircularProgress from "@material-ui/core/CircularProgress";

// import './Header.css';
import "./Home.css";
import axios from "axios";

const cookies = new Cookies();

function LoginButton() {
  return (
    <Link class="nav-link" to="/login">
      Login
    </Link>
  );
}

function LogoutButton() {
  return (
    <Link class="nav-link" to="/logout">
      Logout
    </Link>
  );
}

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessLog, setAccessLog] = useState();
  const [user, setUser] = useState("");

  const getAccesslog = async () => {
    const res = await axios.get("/getuser");
    setUser(res.data.user);

    let body = {
      user_nickname: user,
    };

    axios.post("/getAccesslog", body).then((res) => {
      setAccessLog(res.data["0"].access_log);
    });
  };

  useEffect(() => {
    getAccesslog();
  }, [isModalOpen]);

  let button;
  if (cookies.get("logined")) {
    button = <LogoutButton />;
  } else {
    button = <LoginButton />;
  }

  return (
    <div>
      <div class="header">
        <span class="JEBOBADA">
          JEBOBADA
          <li class="nav-item">{button}</li>


          <button onClick={() => setIsModalOpen(true)}>

            로그인 기록
          </button>
          <Access_log_modal visible={isModalOpen}>
            <h1>로그인 기록 보기</h1>
            <h3>로그인 등 활동 기록을 확인할 수 있습니다.</h3>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>일시</TableCell>
                  <TableCell>로그인IP</TableCell>  
                  <TableCell >로그인</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>  
                {accessLog ? (
                  accessLog.map((c, i) => {
                    return (
                      <Access_log
                        access_time={c.access_time}
                        access_ip={c.access_ip}
                        login={c.login}
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
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <button onClick={() => setIsModalOpen(false)}>닫기</button>
          </Access_log_modal>
        </span>
      </div>
    </div>
  );
};

export default Header;
