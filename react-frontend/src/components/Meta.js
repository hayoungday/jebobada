import React, { Component } from 'react';
import './PostView.css';

class Meta extends Component {
    render() {
        const metadata = this.props.metadata
        return (
            <div class='component_design'>
                <br></br>
                {/* <h1 class='contents_design'>Meta data for audio file</h1> */}
                <h1 class='contents_design'>{metadata.fileName}</h1>
                {console.log(metadata)}
                {/* {console.log(metadata[0])} */}
                {console.log(metadata.fileName)}
                {console.log(metadata.fileType)}
                {console.log(metadata.imageCtime)}
                {console.log(metadata.gpsPosition)}
                {console.log(metadata.deviceModel)}
                {console.log(metadata.lensID)}
                {console.log(metadata.fileFormat)}
                {console.log(metadata.duration)}
                
                {/* {console.log(metadata[0].fileName)} */}
                
                <p class='contents_design'>{metadata.fileName}</p>
                <p class='contents_design'>{metadata.fileType}</p>
                <p class='contents_design'>{metadata.imageCtime}</p>
                <p class='contents_design'>{metadata.gpsPosition}</p>
                <p class='contents_design'>{metadata.deviceModel}</p>
                <p class='contents_design'>{metadata.cameraModelName}</p>
                <p class='contents_design'>{metadata.software}</p>
                <p class='contents_design'>{metadata.lensID}</p>
                <p class='contents_design'>{metadata.description}</p>
                <p class='contents_design'>{metadata.make}</p>

                <p class='contents_design'>{metadata.title}</p>
                <p class='contents_design'>{metadata.fileFormat}</p>
                <p class='contents_design'>{metadata.duration}</p>
                <p class='contents_design'>{metadata.audioCtime}</p>
                <p class='contents_design'>{metadata.voiceMemoUuid}</p>
                <p class='contents_design'>{metadata.encoder}</p>
                <p class='contents_design'>{metadata.majorBrand}</p>
            </div>
        );
    }
}

export default Meta;