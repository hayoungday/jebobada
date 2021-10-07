import React from 'react';
import Header from './Header';
import './Analysis.css';

const Analysis = () => {
    return (
        <div>
            <Header/>
            <br></br>
            <br></br>
            <h3 className="analysis-picture">분석결과</h3>

            <div class="section">

                <input type="radio" name="slide" id="slide01" checked="checked"></input>
                <input type="radio" name="slide" id="slide02" checked="checked"></input>
                <input type="radio" name="slide" id="slide03" checked="checked"></input>
                <input type="radio" name="slide" id="slide04" checked="checked"></input>
                <input type="radio" name="slide" id="slide05" checked="checked"></input>
                <input type="radio" name="slide" id="slide06" checked="checked"></input>
                <input type="radio" name="slide" id="slide07" checked="checked"></input>
                <input type="radio" name="slide" id="slide08" checked="checked"></input>
                <input type="radio" name="slide" id="slide09" checked="checked"></input>

                <div class="slidewrap">
                    <ul class="slidelist">
                        <li>
                            <a>
                                <img src="./static/react/1.jpg"/>
                            </a>
                        </li>
                        <li>
                            <a>
                                <img src="./static/react/2.jpg"/>
                            </a>
                        </li>
                        <li>
                            <a>
                                <img src="./static/react/3.jpg"/>
                            </a>
                        </li>
                        <li>
                            <a>
                                <img src="./static/react/4.jpg"/>
                            </a>
                        </li>
                        <li>
                            <a>
                                <img src="./static/react/5.jpg"/>
                            </a>
                        </li>
                        <li>
                            <a>
                                <img src="./static/react/6.jpg"/>
                            </a>
                        </li>
                        <li>
                            <a>
                                <img src="./static/react/7.jpg"/>
                            </a>
                        </li>
                        <li>
                            <a>
                                <img src="./static/react/8.jpg"/>
                            </a>
                        </li>
                        <li>
                            <a>
                                <img src="./static/react/9.jpg"/>
                            </a>
                        </li>
                    </ul>

                    <div class="slide-control">
                        <div class="control01">
                            <label for="slide09" class="left"></label>
                            <label for="slide02" class="right"></label>
                        </div>
                        <div class="control02">
                            <label for="slide01" class="left"></label>
                            <label for="slide03" class="right"></label>
                        </div>
                        <div class="control03">
                            <label for="slide02" class="left"></label>
                            <label for="slide04" class="right"></label>
                        </div>
                        <div class="control04">
                            <label for="slide03" class="left"></label>
                            <label for="slide05" class="right"></label>
                        </div>
                        <div class="control05">
                            <label for="slide04" class="left"></label>
                            <label for="slide06" class="right"></label>
                        </div>
                        <div class="control06">
                            <label for="slide05" class="left"></label>
                            <label for="slide07" class="right"></label>
                        </div>
                        <div class="control07">
                            <label for="slide06" class="left"></label>
                            <label for="slide08" class="right"></label>
                        </div>
                        <div class="control08">
                            <label for="slide07" class="left"></label>
                            <label for="slide09" class="right"></label>
                        </div>
                        <div class="control09">
                            <label for="slide08" class="left"></label>
                            <label for="slide01" class="right"></label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Analysis;