import React from 'react';
// import './Header.css';
import { Link, RouteComponentProps } from 'react-router-dom';
import './Home.css'


{/* <Link class="nav-link" to="/about">서비스소개</Link> */}

const Home = () => {
    return (
        <div className="wrap">
            <div className="flex-container-main">
                <div className="first_box">
                    <div className="flex-column-container">
                        <span className="first_title">증거등록</span>
                        <div className="flex-column-content-container">
                            <div className="flex-container-first-box">
                                <Link to="/casepage"><img className="upload_image" src="./static/react/upload.png"/></Link>
                                <span className="upload_content">
                                <p/>괴롭힘 피해 증거를 JEBOBADA에 등록할 수 있습니다.<p/>
                                    등록한 증거들은 분석되어 3단계 ANALYSIS에서<p/>
                                    보고서와 대시보드로 확인하실 수 있습니다.<p/>
                                </span>
                            </div>
                            <div className="flex-container-first-box">
                                <Link to="/Download"><img className="download_image" src="./static/react/download.png"/></Link>
                                <span className="download_content">
                                <p/>JEBOBADA의 자체 툴, JB-EXTRACTOR 도구로<p/>
                                    컴퓨터에 남아있는 증거들을 추가로 수집할 수 있습니다.<p/>
                                    먼저 툴을 설치하고, 증거를 추출하여 JEBOBADA에 등록 해보세요!<p/>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="third_box">
                    <div className="flex-column-container">
                        <span className="third_title">보고서<p/>생성/조회/편집</span>
                        
                        <span className="third_content">
                            <p/>등록한 증거들의 분석 결과를<p/>
                                보고서 형태로 제공합니다.<p/>
                                보고서는 직장 내 괴롭힘<p/>
                                신고 시 활용할 수 있습니다.<p/>
                        </span>
                        <Link to="/makereport" className="go_button_box2" style={{textDecoration:'none'}}>
                            <span className="go_button">GO</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>            
    );
};

export default Home;