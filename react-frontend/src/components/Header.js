import React, { useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Cookies } from "react-cookie";

import Access_log from "./Access_log";
import Access_log_modal from "./Access_log_modal";


// import './Header.css';
import "./Home.css";
import "./Main.css"
import axios from "axios";

const cookies = new Cookies();

function LoginButton() {
  return (
    <Link to="/login">
      Login
    </Link>
  );
}

function LogoutButton() {
  return (
    <Link to="/logout">
      Logout
    </Link>
  );
}

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessLog, setAccessLog] = useState();
  const [user, setUser] = useState("");
  
  const closeModal = () => {
    setIsModalOpen(false)
}

  const getAccesslog = async () => {
    const res = await axios.get("/getuser");
    setUser(res.data.user);

    let body = {
      user_nickname: user,
    };

    axios.post("/getAccesslog", body).then((res) => {
      console.log(res.data["0"])
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
    window.location.replace("/main");
    button = <LoginButton />;
  }

  return (
    <div>
      <header id="header" class="  focus:no-underline focus:outline-none" role="button" tabindex="0">
        <div class="container mx-auto flex justify-between items-center px-5 xl:px-0">
            <a href="/main"><div class="logo "></div></a>
            <div class="header-nav justify-between items-center flex flex-wrap ">
                <div class="w-full md:hidden px-5 pb-5 text-right">
                    <div class="flex justify-end">
                        <div class="logo sm mb-1"></div>
                    </div>
                    <p class="montserrat color-light-gray text-xxs">© Wavebridge 2021. All right reserved</p>
                </div>
                
                <nav class="lang">
                    <ul class="flex space-x-6">
                    <li class="">
                        <div role="button" tabindex="0" class="focus:no-underline focus:outline-none active">{button}</div>
                    </li>

                    <li class="">
                        <div role="button" tabindex="0" class="focus:no-underline focus:outline-none active" onClick={()=>setIsModalOpen(true)}>접속 기록</div>
                        <Access_log_modal visible={isModalOpen} closeModal = {closeModal} accessLog = {accessLog}/>
                    </li>
                    </ul>
                </nav>
            </div>
            <button type="button" class="w-8 h-8 btn btn-menu focus:no-underline focus:outline-none  ">
                <span></span><span></span><span></span><span></span>
            </button>
        </div>
      </header>
    </div>
  );
};

export default Header;
