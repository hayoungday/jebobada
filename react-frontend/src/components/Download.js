import React from 'react';
import Header from './Header';
import './Download.css'

const Download = () => {
    return(
        <div>
            <Header/>
            <div no-keyword-injection class="wrapper">
            <div class="hero theme-white">
            <div class="container-columns">
                <div>
                    <h1 class="heading1-dark-blue">JB Extractor</h1>
                    <h4 class="heading4-dark-blue">JB Extractor 툴은 PC에 설치하여 본인 PC에 저장되어 있는 정보들을<br></br>쉽게 분석할 수 있으며, 증명하기 어려운 괴롭힘 정황에 대해서 PC에<br></br> 남아있는 아티팩트를 분석해서 보고서를 제공하는 툴입니다.</h4>
                    <div class="container-buttons-left">
                        {/* <a class="button-orange" href="https://portswigger.net/burp/releases/community/latest"><span class="icon-get-app"></span>Download</a> */}
                        <a class="button-orange" href="https://craftguy.s3.ap-northeast-2.amazonaws.com/JBExtractor.exe">Download</a>
                    </div>
                </div>
                <img alt="download picture" className = "download_pic" src="./static/react/files.jpg"/>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Download;