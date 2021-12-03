import React from 'react';
// import './Header.css';
import FadeIn from 'react-fade-in';
import { Link, RouteComponentProps } from 'react-router-dom';
import './Home.css'
import './mainpage.css'
import DownloadIcon from '@mui/icons-material/Download';


{/* <Link class="nav-link" to="/about">서비스소개</Link> */}

const Home = () => {
    return (
        <div className="wrap">
            <FadeIn>
            <div className="jb_banner"/>
            <div className="jb-main-flex-container">
                <div className="jb_main_card">
                    <div className="jb-main-flex-column-container">
                        <span className="jb_main_card_title">
                            괴롭힘 자료
                        </span>
                        <span className="jb_main_card_subtitle">
                            등록/조회
                        </span>
                        <span className="jb_main_card_contents">
                            직장 내 괴롭힘 관련 자료를 등록하고 조회하며 관리할 수 있습니다.<br/>
                            컴퓨터 사용 기록 추출 프로그램 'JB Extractor'를 통해<br/>
                            컴퓨터에 남아있는 괴롭힘 흔적을 등록할 수 있습니다.
                        </span>
                        <Link to="/casepage" style={{textDecoration:'none'}}>
                            <button className="jb_main_card_button">
                                <div className="jb_main_card_button_icon"/>
                                <span className="jb_main_card_button_text">
                                    내 보관함
                                </span>
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="jb_main_card">
                    <div className="jb-main-flex-column-container">
                        <span className="jb_main_card_title">
                            보고서
                        </span>
                        <span className="jb_main_card_subtitle">
                            생성/조회/편집
                        </span>
                        <span className="jb_main_card_contents">
                            등록한 증거들의 분석 결과를 보고서 형태로 제공합니다.<br/>
                            보고서는 직장 내 괴롭힘 신고 시 활용할 수 있습니다.<br/>
                        </span>
                        <Link to="/makereport" style={{textDecoration:'none'}}>
                            <button className="jb_main_card_button">
                                <div className="jb_main_card_button_icon"/>
                                <span className="jb_main_card_button_text">
                                    작성하기
                                </span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="jb_extractor">
                <div className="jb-main-extractor-flex-container">
                    <div className="jb-main-flex-column-container">
                        <span className="jb_extractor_title">
                            JB Extractor
                        </span>
                        <span className="jb_extractor_content">
                            컴퓨터 사용 기록 추출 프로그램을 통해<br/>
                            컴퓨터에 남아있는 괴롭힘 흔적을 등록할 수 있습니다.
                        </span>
                    </div>
                    <a href="https://craftguy.s3.ap-northeast-2.amazonaws.com/JB+Extractor.exe" style={{textDecoration:'none'}}>
                        <button className="jb_extractor_button">
                            <div className="jb_extractor_button_icon"/>
                            <span className="jb_extractor_button_text">
                                다운로드
                            </span>
                        </button>
                    </a>
                </div>
            </div>
            </FadeIn>
        </div>            
    );
};

export default Home;

{/* <div className="flex-container-main">
            
                <div className="first_box">
                    <div className="flex-column-container-main">
                        <span className="first_title">괴롭힘 자료</span>
                        <h3 style={{
                            textAlign:"center",
                            fontFamily:"NanumSquare-Regular"
                            }}
                        >등록/조회</h3>
                        <div className="flex-column-content-container">

                            <span className="upload_content">
                                <p/>직장 내 괴롭힘 관련 자료를<p/>
                                    등록하고 조회하며 관리할 수 있습니다.<p/><br/>
                                <p/>'JB Extractor' 컴퓨터 사용 기록 추출 프로그램을 통해<p/>
                                컴퓨터에 남아있는 괴롭힘 흔적을 등록할 수 있습니다.
                            </span>

                            <div className="flex-container-first-box">
                                <Link to="/casepage" className="go_button_box2" style={{textDecoration:'none'}}>My Storage</Link>

                                <a href="https://craftguy.s3.ap-northeast-2.amazonaws.com/JB+Extractor.exe" className="go_button_box2" style={{textDecoration:'none'}}>JB Extractor&nbsp; <DownloadIcon/></a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="third_box">
                    <div className="flex-column-container-main">
                        <span className="third_title">보고서</span>
                        <h3 style={{textAlign:"center",fontFamily:"NanumSquare-Regular"}}>생성/조회/편집</h3>
                        
                        <span className="third_content">
                            <p/>등록한 증거들의 분석 결과를<p/>
                                보고서 형태로 제공합니다.<p/><br/>
                                보고서는 직장 내 괴롭힘<p/>
                                신고 시 활용할 수 있습니다.<p/>
                        </span>
                        <Link to="/makereport" className="go_button_box2" style={{textDecoration:'none'}}>
                            Report
                        </Link>
                    </div>
                </div>
                
            </div> */}