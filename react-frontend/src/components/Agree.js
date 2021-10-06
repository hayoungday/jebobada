import React from 'react';
import Header from './Header';
import './Agree.css';

function agreement() {
    alert("영업기밀, 민감 정보 등의 등록은 주의해주시길 바랍니다.")
    window.location.href="/casepage"
}


const Agree = () => {
    return(
        <div>
            <Header/>
            <div class="privacywrap">
                <div class="privacybox">
                    <h4>개인정보 수집 항목 및 방법</h4>
                    JEBOBADA는 직장 내 괴롭힘 피해자 구제를 위하여 증거물로부터 최소한의 범위 내에서 개인을 식별할 수 있는 정보를 수집할 수 있습니다.<br/>
                    수집하는 정보는 개인이 등록한 음성 및 이미지 증거 내의 개인 식별 가능 정보입니다. <br/><br/>
                    <h4>개인정보 수집 및 이용목적</h4>
                    개인정보의 수집 및 이용목적은 개인이 필요 시 증거물 상세 확인, 수정 및 삭제 등의 처리를 위함입니다.<br/><br/>
                    <h4>개인정보의 처리 및 보유 기간</h4>
                    JEBOBADA 시스템을 통해 수집된 개인정보는 개인의 요청 직후 1주일 이내에 파기하는 것을 원칙으로 합니다.<br/><br/>
                </div>
                <p class="agree">
                    {/* <span class="inp_chk"> */}
                        {/* <label for="agree" class="active">
                            <span></span>
                            
                        </label> */}
                        <div class="btn-wrap-agree btn-center">
                        <button onClick={agreement}>개인정보 수집, 이용에 동의합니다.</button>
                        </div>
                        {/* <div class="btn-wrap btn-center">
					        <a href="#" class="btn-black" onclick={agreement()}>개인정보 수집,이용에 동의합니다.</a>
				        </div> */}
                    {/* </span> */}
                </p>
            </div>
        </div>
    )
}

export default Agree;