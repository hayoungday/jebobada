import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Cookies } from "react-cookie"

import './Header.css';
import axios from 'axios';

const cookies = new Cookies()


function LoginButton() {
    return (
        <Link class="nav-link" to="/login">Login</Link>
    );
  }
  
  function LogoutButton() {

    // axios.get("/logout")
    // .then(res => {
    //     console.log(res)
    // })

    return (
        <Link class="nav-link" to="/logout">Logout</Link>
    );
  }

const Header = () => {
    let button;
    // cookies.get('logined')
    if (cookies.get('logined')){
        button = <LogoutButton/>
    }else{
        button = <LoginButton/>
    }
    
    return (
        <div>
            
        <nav class="navbar navbar-expand-lg " id="mainNav">
            <div class="container">
                <Link class="navbar-brand" to="/">JeBoBaDa</Link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    Menu
                    <i class="fas fa-bars ms-1"></i>
                </button>
                <div class="collapse navbar-collapse" id="navbarResponsive">
                    {/* <ul class="navbar-nav text-uppercase ms-auto py-4 py-lg-0"> */}
                    <ul class="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
                        <li class="nav-item"><Link class="nav-link" to="/about">서비스소개</Link></li>
                        <li class="nav-item"><Link class="nav-link" to="/Agree">업로드</Link></li>
                        <li class="nav-item"><Link class="nav-link" to="/download">다운로드</Link></li>
                        <li class="nav-item"><Link class="nav-link" to="/analysis">분석결과</Link></li>
                        {/* <li class="nav-item"><Link class="nav-link" to="/login">{button}</Link></li> */}
                        <li class="nav-item">{button}</li>
                    </ul>
                </div>
            </div>
        </nav>
        
        </div>
    );
};

export default Header;