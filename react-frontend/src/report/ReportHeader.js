import React, { useState,useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './reportHeader.css';
/* 아이콘 컬러 전체 변경 기능 */
import { IconContext } from 'react-icons';
import axios from 'axios'

const ReportHeader = () => {

    const [user, setUser] = useState("");
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);
    
    
    return (
        <>
        {/* 아이콘 컬러 전체 변경 기능 */}
        <IconContext.Provider value={{ color: '#fff' }}>
            {/* 네비게이션 토글 코드*/}
            {/* <div className="navbar">
            <Link to="#" className="menu-bars">
                <FaIcons.FaBars onClick={showSidebar} />
            </Link>
            </div> */}
            <nav className='nav-menu active'>
                <ul className="nav-menu-items">
                    {/* SidebarData를 순서대로 담기*/}
                    {SidebarData.map((item, index) => {
                    return (
                        <li key={index} className={item.cName}>
                        <Link to={item.path}>
                            {item.icon}
                            <span>{item.title}</span>
                        </Link>
                        </li>
                    );
                    })}
                </ul>
            </nav>
        </IconContext.Provider>
        </>
    );

}

export default ReportHeader