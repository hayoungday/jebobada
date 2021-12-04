import React, {useEffect, useState, useRef} from 'react';
import './reportHeader.css'
import ViewArtifact from './ViewArtifact'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { getThemeProps } from '@material-ui/styles';

const EvidenceDetailsEdit = (props) => {

  const onFilenameHandler = (event) =>{
    console.log(event.target.value)
    props.setFilename(event.target.value)
  }

  const onDateHandler = (event) => {
    console.log(event.target.value)
    props.setDate(event.target.value);
  };

  const onLocationHandler = (event) => {
    // props.setLocation(event.currentTarget.value);
    console.log(event.target.value)
    props.setLocation(event.target.value)
  };

  const onAttackerHandler = (event) => {
    console.log(event.target.value)
    props.setAttacker(event.target.value)
  }

  const onDescHandler = (event) => {
    console.log(event.target.value)
    props.setDesc(event.target.value)
  }

  

  // const onFiletypeHandler = (event) =>{
  //   props.setFiletype(event.currentTarget.value)
  // }
  // const onFilesizeHandler = (event) =>{
  //   props.setFilesize(event.currentTarget.value)
  // }
  // const onImageCtimeHandler = (event) =>{
  //   props.setImageCtime(event.currentTarget.value)
  // }
  // const onGpsPositionHandler = (event) =>{
  //   props.setgpsPosition(event.currentTarget.value)
  // }
  // const onDeviceModelHandler = (event) =>{
  //   props.setDeviceModel(event.currentTarget.value)
  // }
  // const onSoftwareHandler = (event) =>{
  //   props.setSoftware(event.currentTarget.value)
  // }

  return(
    <>
      {/* <DialogTitle><h1>수정하기</h1></DialogTitle> */}
      <DialogContent>
        {/* <DialogContentText>
          <h3>메타데이터 수정</h3>
        </DialogContentText>
        
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="파일 이름"
          type="text"
          value={props.filename}
          fullWidth
          variant="standard"
          onChange={onFilenameHandler}
        />
        <TextField
          autoFocus
          margin="dense"
          id="type"
          label="파일 형식"
          type="text"
          value={props.filetype}
          fullWidth
          variant="standard"
          onChange={onFiletypeHandler}
        />
        <TextField
          autoFocus
          margin="dense"
          id="size"
          label="파일 크기"
          type="text"
          value={props.filesize}
          fullWidth
          variant="standard"
          onChange={onFilesizeHandler}
        />
        <TextField
          autoFocus
          margin="dense"
          id="Ctime"
          label="촬영 시각"
          type="text"
          value={props.imageCtime}
          fullWidth
          variant="standard"
          onChange={onImageCtimeHandler}
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="촬영 장소"
          type="text"
          value={props.gpsPosition}
          fullWidth
          variant="standard"
          onChange={onGpsPositionHandler}
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="촬영 기기"
          type="text"
          value={props.deviceModel}
          fullWidth
          variant="standard"
          onChange={onDeviceModelHandler}
        />
        <TextField
        autoFocus
        margin="dense"
        id="name"
        label="촬영 기기 소프트웨어 버전"
        type="text"
        value={props.software}
        fullWidth
        variant="standard"
        onChange={onSoftwareHandler}
      />
      <br/><br/> */}
        <DialogContentText>
          <h3>상세 설명 수정</h3>
        </DialogContentText>

        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="파일 이름"
          type="text"
          defaultValue={props.filename}
          fullWidth
          variant="standard"
          onChange={(e)=>onFilenameHandler(e)}
        />
        
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="일시"
          type="date"
          defaultValue={props.date}
          fullWidth
          variant="standard"
          onChange={(e)=>onDateHandler(e)}
        />
        <TextField
          autoFocus
          margin="dense"
          id="type"
          label="발생 장소"
          type="text"
          defaultValue={props.location}
          fullWidth
          variant="standard"
          onChange={(e)=>onLocationHandler(e)}
        />
        <TextField
          autoFocus
          margin="dense"
          id="size"
          label="행위자"
          type="text"
          defaultValue={props.attacker}
          fullWidth
          variant="standard"
          onChange={(e)=>onAttackerHandler(e)}
        />
        <TextField
          autoFocus
          margin="dense"
          id="Ctime"
          label="상세 설명"
          multiline
          rows={4}
          defaultValue={props.desc}
          fullWidth
          variant="standard"
          onChange={(e)=>onDescHandler(e)}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>취소</Button>
        <Button onClick={props.handleSubmit}>수정하기</Button>
      </DialogActions>
    </>
  )
  
}

export default EvidenceDetailsEdit;