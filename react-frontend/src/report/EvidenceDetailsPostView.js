import React, {useEffect, useState} from 'react';
import './reportHeader.css'
import ViewArtifact from './ViewArtifact'



const EvidenceDetailsPostView = (props) => {

    const url = "https://craftguy.s3.ap-northeast-2.amazonaws.com/"+ props.filehash

    if (props.filetype === "사진 파일"){
      return(
        <div>
            <h1>증거자료{props.idx+1} | {props.filename} </h1>
            <img class='image_contents_design' src={url} />
            <br/>
            <label>파일 이름 : {props.filename}</label><br/>
            <label>파일 형식 : {props.meta.fileType}</label><br/>
            <label>파일 크기 : {props.meta.fileSize}</label><br/>
            <label>촬영 시각 : {props.meta.iamgeCtime}</label><br/>
            <label>촬영 장소 : {props.meta.gpsPosition}</label><br/>
            <label>촬영 기기 : {props.meta.deviceModel}</label><br/>
            <label>촬영 기기 소프트웨어 버전 : {props.meta.software}</label><br/>
            <br/>
            <label>일시: {props.date}</label><br/>
            <label>발생 장소: {props.location}</label><br/>
            <label>행위자: {props.attacker.join(",")}</label><br/>
            <label>상세 설명: {props.desc}</label><br/><br/><br/>
        </div>
      )
    } else if (props.filetype === "녹음 파일"){
      return(
        <div>
          <h1>증거자료{props.idx+1} | {props.filename} </h1>
          <div class='image_contents_design'>

          </div>
          <br/>
          <label>파일 이름 : {props.filename}</label><br/>
          <label>파일 형식 : {props.meta.fileType}</label><br/>
          <label>파일 크기 : {props.meta.fileSize}</label><br/>
          <label>녹음 시각 : {props.meta.audioCtime}</label><br/>
          <label>녹음 장소 : {props.meta.title}</label><br/>
          <label>녹음 길이 : {props.meta.duration}</label><br/>
          
          <br/>
          <label>일시: {props.date}</label><br/>
          <label>발생 장소: {props.location}</label><br/>
          <label>행위자: {props.attacker.join(",")}</label><br/>
          <label>상세 설명: {props.desc}</label><br/><br/><br/>
        </div>
      )
    } else{
      return(
        <div>
          {console.log(props.data)}
          <h1>증거자료{props.idx+1} | {props.filename} </h1>
          <br/>
          <ViewArtifact data={props.data} object_id={props._id}/>
          <br/>
          <label>행위자: {props.attacker.join(",")}</label><br/>
          <label>상세 설명: {props.desc}</label><br/><br/><br/>
          <br/>
          <h3>컴퓨터 사용 기록 해석</h3>
          {props.attacker.join(",")} 에게 컴퓨터 관련 괴롭힘 피해를 당했습니다.<p/>
          정규 근무 시간은 {props.date} 입니다.<p/>
          괴롭힘을 당한 날인 [아티팩트 로그온 시간]에 근무를 시작하여, [아티팩트 로그오프 시간] 까지 초과근무를 하였습니다.<p/>
          {props.bulltype.join(",")}와 관련하여 사용한 프로그램은 [프로그램 관련 아티팩트]이고, 작업한 파일은 [문서관련 아티팩트]입니다.<p/>
          괴롭힘으로 인해 방문했던 인터넷 사이트는 [웹 관련 아티팩트] 입니다.<p/>
          초과근무 때 연결했던 장치는 [USB 관련 아티팩트] 입니다.<p/>
          <br/><br/>
        </div>
      )
    }
    
}

export default EvidenceDetailsPostView;