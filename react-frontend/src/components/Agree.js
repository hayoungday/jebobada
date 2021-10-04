import React from 'react';
import Header from './Header';
import './Agree.css';

function agreement() {
    alert("영업기밀, 민감 정보 등의 등록은 주의해주시길 바랍니다.")
    window.location.href="/upload"
}


const Agree = () => {
    return(
        <div>
            <Header/>
            <div class="privacywrap">
                <div class="privacybox">
                    <h4>개인정보 수집 항목 및 방법</h4>
                    LG그룹의 사이버신문고는 제보의 충실한 처리를 위하여, 필요한 최소한의 범위 내에서 개인정보를 수집합니다.<br/>
                    수집하는 정보는 ‘성명, 이메일(e-mail) 주소, 전화(핸드폰)번호’ 입니다. 개인정보의 제공을 원하지 않으실 경우는 ‘익명’으로
                    제보하실 수 있습니다. 단, 익명 제보의 경우는 제보 접수 확인 및 신고포상 등 업무처리에 제약이 있을 수 있습니다 <br/><br/>
                    <h4>개인정보 수집 및 이용목적</h4>
                    개인정보의 수집 및 이용목적은 필요 시 제보 내용 추가 확인, 접수 확인 안내, 신고포상 등 업무처리를 위함입니다.<br/><br/>
                    <h4>개인정보의 처리 및 보유 기간</h4>
                    사이버신문고 시스템을 통해 수집된 개인정보는 제보 건에 대한 종결처리가 완료된 후 1년간 보관하는 것을 원칙으로 하나, 신고포상 해당 건 등 별도의 보관이 필요한 경우는 예외로 합니다.<br/><br/>
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