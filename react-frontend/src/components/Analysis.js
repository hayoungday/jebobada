import React from 'react';
import Header from './Header';


const Analysis = () => {
    return(
        <div>
            <Header/>
            <h3 className="analysis-picture">분석결과</h3>
            <div className="analysis-picture">
                <img alt="analysis picture" src="./static/react/분석결과.png"/>
            </div>
        </div>
    )
}

export default Analysis;