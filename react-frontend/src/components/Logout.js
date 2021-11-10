import React from 'react';
import Header from './Header';
import axios from 'axios'

const Logout = ({history}) => {

    axios.get("/logout")
    .then(res => {
        console.log(res)
        history.push('/')
    })

    return(
        <div>
            <Header/>
            <h1>로그아웃페이지</h1>
        </div>
    )
}

export default Logout;