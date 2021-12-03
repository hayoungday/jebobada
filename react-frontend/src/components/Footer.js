import React, { useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Cookies } from "react-cookie";

const Footer = () => {

    return(
        <footer id="footer" className="jb_footer">
            <div>
            <span>이용약관 개인정보처리방침 FAQ</span>
            </div>
        </footer>
    )
}

export default Footer;