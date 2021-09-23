import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import './Header.css';


// const MenuItem = ({active, children, to}) => (
//     <div className="menu-item">
//             {children}
//     </div>
// )


const Header = () => {
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
                        <li class="nav-item"><Link class="nav-link" to="/upload">업로드</Link></li>
                        <li class="nav-item"><Link class="nav-link" to="/download">다운로드</Link></li>
                        <li class="nav-item"><Link class="nav-link" to="/faq">FAQ</Link></li>
                        <li class="nav-item"><Link class="nav-link" to="/login">Login</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
        
        </div>
    );
};

export default Header;