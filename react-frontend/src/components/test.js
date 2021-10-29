import React, { Component, useState } from 'react';
import PropTypes from 'prop-types'
import styled from 'styled-components'

const physics = ["폭행", "폭언"]
const lang = ["모욕","협박","비하"]
const onwork = ["무시","정보차단","차단","배제","사적지시","전가","업무제외","SNS","야근","건의","감시","사직종용","반성문(시말서 강요)","차별","사비"]
const outwork = ["행사","장기자랑 강요","강요","후원 강요","휴가","육아휴직","모임","실업급여"]
const group = ["따돌림","소문","비밀","태움"]
const sexual = ["성희롱"]



function Check_Modal({ className, visible, type, children }) {
  const [chk_physics, setPhysics] = useState(new Array(physics.length).fill(false))
  const [chk_lang, setLang] = useState(new Array(lang.length).fill(false))
  const [chk_onwork, setOnwork] = useState(new Array(onwork.length).fill(false))
  const [chk_outwork, setOutwork] = useState(new Array(outwork.length).fill(false))
  const [chk_group, setGroup] = useState(new Array(group.length).fill(false))
  const [chk_sexual, setSexual] = useState(new Array(sexual.length).fill(false))

  const modal_contents =(type)=>{

    const onPhysicsHandler = (position) => {
      const updatedchecked = chk_physics.map((item, index)=>
          index === position ? !item : item
      )
      setPhysics(updatedchecked)
    }
    const onLangHandler = (position) => {
      const updatedchecked = chk_lang.map((item, index)=>
          index === position ? !item : item
      )
      setLang(updatedchecked)
    }
    const onWorkHandler = (position) => {
      const updatedchecked = chk_onwork.map((item, index)=>
          index === position ? !item : item
      )
      setOnwork(updatedchecked)
    }
    const onOutworkHandler = (position) => {
      const updatedchecked = chk_outwork.map((item, index)=>
          index === position ? !item : item
      )
      setOutwork(updatedchecked)
    }
    const onGroupHandler = (position) => {
      const updatedchecked = chk_group.map((item, index)=>
          index === position ? !item : item
      )
      setGroup(updatedchecked)
    }
    const onSexualHandler = (position) => {
      const updatedchecked = chk_sexual.map((item, index)=>
          index === position ? !item : item
      )
      setSexual(updatedchecked)
    }

    if (type == "physics"){
      return (
        <div>
          <h1>신체적 괴롭힘</h1>
          {physics.map((item,index)=>{
            return(
                <li key={index}>
                    <label>
                    <input type="checkbox" name={item} value={item} checked={setPhysics[index]} onChange={()=>onPhysicsHandler(index)}/>
                    {item}
                    </label>
                </li>
            )
          })}
        </div>
      );
    } else if (type == "lang"){
      return (
        <div>
          <h1>언어적 괴롭힘</h1>
          {lang.map((item,index)=>{
            return(
                <li key={index}>
                    <label>
                    <input type="checkbox" name={item} value={item} checked={setLang[index]} onChange={()=>onLangHandler(index)}/>
                    {item}
                    </label>
                </li>
            )
          })}
        </div>
      );    
    } else if (type == "onwork"){
      return (
        <div>
          <h1>직장 내에서 발생한 괴롭힘</h1>
          {onwork.map((item,index)=>{
            return(
                <li key={index}>
                    <label>
                    <input type="checkbox" name={item} value={item} checked={setOnwork[index]} onChange={()=>onWorkHandler(index)}/>
                    {item}
                    </label>
                </li>
            )
          })}
        </div>
      );    
    } else if (type == "outwork"){
      return (
        <div>
          <h1>직장 밖에서 발생한 괴롭힘</h1>
          {outwork.map((item,index)=>{
            return(
                <li key={index}>
                    <label>
                    <input type="checkbox" name={item} value={item} checked={setOutwork[index]} onChange={()=>onOutworkHandler(index)}/>
                    {item}
                    </label>
                </li>
            )
          })}
        </div>
      );    
    } else if (type == "group"){
      return (
        <div>
          <h1>집단적 괴롭힘</h1>
          {group.map((item,index)=>{
            return(
                <li key={index}>
                    <label>
                    <input type="checkbox" name={item} value={item} checked={setGroup[index]} onChange={()=>onGroupHandler(index)}/>
                    {item}
                    </label>
                </li>
            )
          })}
        </div>
      );
    } else if (type == "sexual"){
      return (
        <div>
          <h1>성희롱</h1>
          {sexual.map((item,index)=>{
            return(
                <li key={index}>
                    <label>
                    <input type="checkbox" name={item} value={item} checked={setSexual[index]} onChange={()=>onSexualHandler(index)}/>
                    {item}
                    </label>
                </li>
            )
          })}
        </div>
      );
    }
  }
  console.log(chk_physics)
  console.log(chk_group)
  console.log(chk_lang)
  console.log(chk_onwork)
  console.log(chk_outwork)
  console.log(chk_sexual)
    return (
      <>
        <ModalOverlay visible={visible} />
        <ModalWrapper className={className} tabIndex="-1" visible={visible}>
          <ModalInner tabIndex="0" className="modal-inner">
            {children}
            {modal_contents(type)}
          </ModalInner>
        </ModalWrapper>
      </>
    )
  }

  

  
  
  Check_Modal.propTypes = {
    visible: PropTypes.bool,
    type: PropTypes.string
  }
  
  const ModalWrapper = styled.div`
    box-sizing: border-box;
    display: ${(props) => (props.visible ? 'block' : 'none')};
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    overflow: auto;
    outline: 0;
  `
  
  const ModalOverlay = styled.div`
    box-sizing: border-box;
    display: ${(props) => (props.visible ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 999;
  `
  
  const ModalInner = styled.div`
    box-sizing: border-box;
    position: relative;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
    background-color: #dee5f8;
    border-radius: 50px;
    width: 600px;
    max-width: 800px;
    height: 400px;
    top: 50%;
    transform: translateY(-50%);
    margin: 0 auto;
    padding: 40px 20px;
  `

export default Check_Modal;