import React from 'react';
import Header from './Header';
import axios from 'axios';
import {useDispatch} from "react-redux"
import { CLIENT_ID, REDIRECT_URI, CLIENT_SECRET} from './config';
import { Cookies } from "react-cookie"

// import {actionCreators as userActions} from "./user"



const Oauth = ({history}) => {
    let code = new URL(window.location.href).searchParams.get("code");
    console.log(code)
    
    let data = {
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        code: code
    }
    const cookies = new Cookies()

    axios.post("/oauth",data)
    .then(res=>{
        if (cookies.get('logined')){
            history.push('/')
        }

    })


    return(
        <div>
            <Header/>
        </div>
    )
}

export default Oauth;