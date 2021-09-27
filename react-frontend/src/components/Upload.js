import React from 'react';
import Header from './Header';


const Upload = () => {
    return(
        <div>
            <Header/>
            <h1>This is Upload page</h1>
            <form action = "http://localhost:80/Upload" method = "POST" enctype = "multipart/form-data">
                <input type = "file" name = "file" />
                {/* <label className="input-file-button" for="input-file">
                    파일 업로드
                </label> */}
                <input type = "submit" />
            </form>
        </div>
    )
}
export default Upload;