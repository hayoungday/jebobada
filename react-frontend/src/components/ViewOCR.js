import React, { Component } from 'react';

class ViewOCR extends Component {
    render() {
        const url = "https://craftguy.s3.ap-northeast-2.amazonaws.com/"+this.props.hashed_filename
        return (
            <div>
                <br></br>
                <img src={url} />
            </div>
        );
    }
}

export default ViewOCR;