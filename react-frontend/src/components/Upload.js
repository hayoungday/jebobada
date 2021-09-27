import React, {Component} from 'react';
import Header from './Header';


class Upload extends Component { 
    state = { 
        boards: [ 
            { 
                brdno: 1, 
                brdwriter: 'Lee SunSin', 
                brdtitle: 'If you intend to live then you die', 
                brddate: new Date() 
            }, 
            { 
                brdno: 2, 
                brdwriter: 'So SiNo', 
                brdtitle: 'Founder for two countries', 
                brddate: new Date() 
            } 
        ] 
    } 
    
    render() { 
        const { boards } = this.state; 
        const list = boards.map(function(row){ 
            return row.brdno + row.brdwriter ; 
        }); 
        
        return ( 
            <div>
                <Header/>
                <h1>This is Upload page</h1>
                <form action = "/upload" method = "POST" enctype = "multipart/form-data">
                    <input type = "file" name = "file" />
                    {/* <label className="input-file-button" for="input-file">
                        파일 업로드
                    </label> */}
                    <input type = "submit" />
                </form> 
                <table border="1"> 
                    <tbody> 
                        <tr align="center"> 
                            <td width="50">No.</td> 
                            <td width="300">Title</td> 
                            <td width="100">Name</td> 
                            <td width="100">Date</td> 
                        </tr> 
                        { 
                            boards.map(row => 
                                (<BoardItem key={row.brdno} row={row} />) 
                            ) 
                        } 
                    </tbody> 
                </table>
            </div> 
        ); 
    } 
}

class BoardItem extends React.Component { 
    render() { 
        return( 
            <tr> 
                <td>{this.props.row.brdno}</td> 
                <td>{this.props.row.brdtitle}</td> 
                <td>{this.props.row.brdwriter}</td> 
                <td>{this.props.row.brddate.toLocaleDateString('ko-KR')}</td> 
            </tr> 
        ); 
    } 
}



export default Upload;