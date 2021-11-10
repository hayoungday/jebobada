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
import Button from "@material-ui/core/Button";

// import './Header.css';
import "./Home.css";
import axios from "axios";

const cookies = new Cookies();

function LoginButton() {
  return (
    <Button>
      <Link to="/login">Login</Link>
    </Button>
  );
}

function LogoutButton() {
  return (
    <Button>
      <Link to="/logout">Logout</Link>
    </Button>
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
      <Link to="/artifact_upload_test">test</Link>
      <div class="header">
        <span class="JEBOBADA">JEBOBADA</span>

        <span class="access_log_button">
          {button}
          <Button
            size=""
            variant="contained"
            onClick={() => setIsModalOpen(true)}
          >
            로그인 기록
          </Button>
        </span>

        <Access_log_modal visible={isModalOpen}>
          <h1>로그인 기록</h1>
          <h3>로그인 기록을 확인할 수 있습니다.</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>일시</TableCell>
                <TableCell>로그인IP</TableCell>
                <TableCell>로그인</TableCell>
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
                    <h3>로그인 후 확인 바랍니다</h3>
                    <br></br>
                    <br></br>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Button variant="contained" onClick={() => setIsModalOpen(false)}>
            닫기
          </Button>
        </Access_log_modal>
      </div>
    </div>
  );
};

export default Header;
