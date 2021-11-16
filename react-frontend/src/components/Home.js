import React from 'react';
// import './Header.css';
import FadeIn from 'react-fade-in';
import { Link, RouteComponentProps } from 'react-router-dom';
import './Home.css'
import DownloadIcon from '@mui/icons-material/Download';


{/* <Link class="nav-link" to="/about">서비스소개</Link> */}

const Home = () => {
    return (
        <div className="wrap">
            <FadeIn>
            <div className="flex-container-main">
            
                <div className="first_box">
                    <div className="flex-column-container-main">
                        <span className="first_title">괴롭힘 자료</span>
                        <h3 style={{textAlign:"center"}}>등록/조회</h3>
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
                        <h3 style={{textAlign:"center"}}>생성/조회/편집</h3>
                        
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
                
            </div>
            </FadeIn>
        </div>            
    );
};

export default Home;