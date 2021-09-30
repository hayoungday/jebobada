import React, { Component } from 'react';

class ViewFile extends Component {
    render() {
        const listdata = this.props.text.map((d) => <p key={d.speaker}><h5>화자{d.speaker}</h5>{d.stt}</p>);
        const url = "https://craftguy.s3.ap-northeast-2.amazonaws.com/"+this.props.hashed_filename
        return (
            <div>
                <br></br>
                <h1>{this.props.name}</h1>
                <br></br>
                {console.log(this.props.text)}
                {listdata}
                {console.log(url)}
                <audio controlsList="nodownload" controls>                   
                    <source src={url} type="audio/mpeg" />
                </audio>
            </div>
        );
    }
}

export default ViewFile;