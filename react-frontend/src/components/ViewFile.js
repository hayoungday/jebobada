import React, { Component } from 'react';
import Highlighter from "react-highlight-words";


class ViewFile extends Component {
    render() {
        const listdata = this.props.text.map((d) => <p class='audio_contents_design' key={d.speaker}><h5>화자{d.speaker}</h5><Highlighter  highlightStyle={{backgroundColor: 'yellow'}} searchWords={[this.props.keyword]} textToHighlight={d.stt}/></p>);
        const url = "https://craftguy.s3.ap-northeast-2.amazonaws.com/"+this.props.hashed_filename
        return (
            <div class='component_design'>                          
                <br></br>
                <h1 class='audio_contents_design'>{this.props.name}</h1>
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