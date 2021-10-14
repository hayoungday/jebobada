import React from 'react';
import Header from './Header';
import './Agree.css';

function agreement() {
    alert("영업기밀, 민감 정보 등의 등록은 주의해주시길 바랍니다.")
    window.location.href="/casepage"
}


const Agree = () => {
    return(
        <div className="flex-column-container">
            <Header/>
            <div className="flex-container-agree">
                <div className="agree-box" style={{backgroundColor: "#3d7be6"}}>
                    <span className="agree-text" style={{color: "#fff"}}>개인정보<p/>수집 및 이용 동의</span>
                </div>
                <img className="connect-square" src="./static/react/square_icon.png"/>
                <div className="case-box" style={{backgroundColor: "#dee5f8"}}>
                    <span className="case-text" style={{color: "#000"}}>사건 생성 및 선택</span>
                </div>
                <img className="connect-square" src="./static/react/square_icon.png"/>
                <div className="upload-box" style={{backgroundColor: "#dee5f8"}}>
                    <span className="upload-text" style={{color: "#000"}}>증거 등록</span>
                </div>
            </div>

            <div className="agreement-box">
                <span className="agreement">
                    <span className="textstyle">개인정보 수집 항목 및 방법<br/></span>
                        JEBOBADA는 직장 내 괴롭힘 피해자 구제를 위하여 증거물로부터 최소한의 범위 내에서 개인을 식별할 수 있는 정보를 수집할 수 있습니다.
                        수집하는 정보는 개인이 등록한 음성 및 이미지 증거 내의 개인 식별 가능 정보입니다.<br/><br/>
                    <span className="textstyle">개인정보 수집 및 이용목적<br/></span>
                        개인정보의 수집 및 이용목적은 개인이 필요 시 증거물 상세 확인, 수정 및 삭제 등의 처리를 위함입니다.<br/><br/>
                    <span className="textstyle">개인정보의 처리 및 보유 기간<br/></span>
                        JEBOBADA 시스템을 통해 수집된 개인정보는 개인의 요청 직후 1주일 이내에 파기하는 것을 원칙으로 합니다.<br/>
                </span>
            </div>

            <button className="agree-button" onClick={agreement}>
                <span className="agree-button-content">
                    개인정보 수집  및 이용에 동의합니다
                </span>
            </button>
        </div>
    )
}

export default Agree;