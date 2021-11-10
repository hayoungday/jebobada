import React, {useState} from 'react';
import './Main.css'
import {Link} from 'react-router-dom';
import { Cookies } from "react-cookie";
import Login_Modal from './Login_Modal';
import Signup_Modal from './Signup_Modal';




const CheckList = () => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSignupModalOpen,setIsSignupModalOpen] = useState(false)

    const cookies = new Cookies();

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const closeSignupModal=()=>{
        setIsSignupModalOpen(false)
    }

    if (cookies.get("logined")) {
        window.location.replace("/");
    }

    return(
        <div class="App">
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
                        <nav class="nav">
                            <ul class="block md:flex poppins md:space-x-8 lg:space-x-16">
                                <Link to="/main"><li class="">Home</li></Link>
                                <Link to="/aboutus"><li class="">About Us</li></Link>
                                <Link to="/checklist"><li class="active">CheckList</li></Link>
                            </ul>
                        </nav>
                        <nav class="lang">
                            <ul class="flex space-x-6">
                                <li class="">
                                    <div role="button" tabindex="0" class="focus:no-underline focus:outline-none active" onClick={()=>setIsModalOpen(true)}>Login</div>
                                </li>
                                <Login_Modal visible={isModalOpen} closeModal = {closeModal}/>

                                <li class="">
                                    <div role="button" tabindex="0" class="focus:no-underline focus:outline-none active" onClick={()=>setIsSignupModalOpen(true)}>Sign up</div>
                                </li>
                                <Signup_Modal visible={isSignupModalOpen} closeModal={closeSignupModal}/>
                            </ul>
                        </nav>
                    </div>
                    <button type="button" class="w-8 h-8 btn btn-menu focus:no-underline focus:outline-none  ">
                        <span></span><span></span><span></span><span></span>
                    </button>
                </div>
            </header>
                
            <div id="wrap" class="wrap">
                <div class="contents">
                    <div class="container mx-auto pl-5 pr-2.5 md:px-5 xl:px-0">
                        <h1 class="montserrat color-dark-blue mb-24 hidden md:block">직장 내 괴롭힘 여부 확인용 체크리스트</h1>
                        <h1 class="montserrat color-dark-blue mb-10 md:hidden leading-10">직장 내 괴롭힘 여부 확인용 체크리스트</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckList;