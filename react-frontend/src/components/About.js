import React from 'react';
import Header from './Header';
import './Header.css';


const About = () => {
    return(
        <div>
        <Header/>
        <section>
        <div class="container">
                <div class="text-center">
                    <h2 class="section-heading text-uppercase">About</h2>
                    <h3 class="section-subheading text-muted"></h3>
                </div>
                <ul class="timeline">
                    <li>
                        <div class="timeline-image"><img class="rounded-circle img-fluid" src="./static/react/files.jpg" alt="..." /></div>
                        <div class="timeline-panel">
                            <div class="timeline-heading">
                                <h4>1.</h4>
                                <h4 >피해자 스스로 관련 증거를 모을 수 있는 창구를 만들어 증거물 관리를 쉽도록 도와드립니다.</h4>
                            </div>
                            <div class="timeline-body"><p class="text-muted">제보바다 서비스에 직장 내 괴롭힘 관련 증거를 사건별로 업로드 가능</p></div>
                        </div>
                    </li>
                    <li class="timeline-inverted">
                        <div class="timeline-image"><img class="rounded-circle img-fluid" src="./static/react/security.jpg" alt="..." /></div>
                        <div class="timeline-panel">
                            <div class="timeline-heading">
                                <h4>2.</h4>
                                <h4 class="subheading">암호화뿐만 아니라, 증거물 접근 기록까지 확인할 수 있어 신뢰성있는 서비스 보장합니다.</h4>
                            </div>
                            <div class="timeline-body"><p class="text-muted">등록한 증거물들은 암호화되어 안전하게 보관</p></div>
                        </div>
                    </li>
                    <li>
                        <div class="timeline-image"><img class="rounded-circle img-fluid" src="./static/react/searchengine.jpg" alt="..." /></div>
                        <div class="timeline-panel">
                            <div class="timeline-heading">
                                <h4>3.</h4>
                                <h4 class="subheading">캡처 및 녹음 증거물에 대한 텍스트 변환을 통해, 다양한 증거물을 검색 가능하도록 하여 사용자가 증거물에 편리하게 접근할 수 있습니다.</h4>
                            </div>
                            <div class="timeline-body"><p class="text-muted">녹음 증거물일 경우 녹음 파일에 대한 대화 스크립트를 제공하여 실제 증거물 제출 시 활용 가능</p></div>
                        </div>
                    </li>
                    <li class="timeline-inverted">
                        <div class="timeline-image"><img class="rounded-circle img-fluid" src="./static/react/artificial.jpg" alt="..." /></div>
                        <div class="timeline-panel">
                            <div class="timeline-heading">
                                <h4>4.</h4>
                                <h4 class="subheading">컴퓨터의 *괴롭힘 관련 증거물을 추출할 수 있는 프로그램을 제공하여 피해자 스스로 수집하기 힘든 컴퓨터 증거물을 수집 및 분석 가능합니다.</h4>
                            </div>
                            <div class="timeline-body"><p class="text-muted">* 괴롭힘 관련 증거물(응용 프로그램 실행 기록, 문서 열람기록, 인터넷 사용 기록, 외부 장치 사용 기록 등)</p></div>
                        </div>
                    </li>
                    <li>
                        <div class="timeline-image"><img class="rounded-circle img-fluid" src="./static/react/fake.jpg" alt="..." /></div>
                        <div class="timeline-panel">
                            <div class="timeline-heading">
                                <h4>5.</h4>
                                <h4 class="subheading">음성 증거물에 대한 악의적인 편집 논란이 발생할 경우를 대비하여, 음성 증거물에 대한 위변조 여부를 탐지해드립니다.</h4>
                            </div>
                            <div class="timeline-body"><p class="text-muted">피해자가 업로드한 음성 증거물에 대해 위변조 여부를 탐지하여 음성 증거물에 대한 신뢰도를 높임</p></div>
                        </div>
                    </li>
                    <li class="timeline-inverted">
                        <div class="timeline-image"><img class="rounded-circle img-fluid" src="./static/react/analysis.jpg" alt="..." /></div>
                        <div class="timeline-panel">
                            <div class="timeline-heading">
                                <h4>6.</h4>
                                <h4 class="subheading">실제 직장 내 괴롭힘 신고 시 활용할 수 있도록 제보바다 서비스에서 직장 내 괴롭힘 대시보드 및 분석 보고서를 제공해드립니다.</h4>
                            </div>
                            <div class="timeline-body"><p class="text-muted">제보바다 서비스에 업로드한 증거물에 대한 연관분석 결과를 대시보드와 보고서 형태로 제공 </p></div>
                        </div>
                    </li>
                    <li class="timeline-inverted">
                        <div class="timeline-image">
                            <h4>
                                Be Part
                                <br />
                                Of Our
                                <br />
                                Story!
                            </h4>
                        </div>
                    </li>
                </ul>
            </div>
            </section>
            </div>
    )
}

export default About;