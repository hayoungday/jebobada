import React, { Component, useState, List } from 'react';
import PropTypes from 'prop-types'
import styled from 'styled-components'

const physics = ["폭행", "폭언"]
const lang = ["모욕","협박","비하"]
const onwork = ["무시","정보차단","차단","배제","사적지시","전가","업무제외","SNS","야근","건의","감시","사직종용","반성문(시말서 강요)","차별","사비"]
const outwork = ["행사","장기자랑 강요","강요","후원 강요","휴가","육아휴직","모임","실업급여"]
const group = ["따돌림","소문","비밀","태움"]
const sexual = ["성희롱"]



function Check_Modal({ className, visible, type, children, getSetValue }) {

  const [chk_physics, setPhysics] = useState(new Array(physics.length).fill(false))
  const [chk_lang, setLang] = useState(new Array(lang.length).fill(false))
  const [chk_onwork, setOnwork] = useState(new Array(onwork.length).fill(false))
  const [chk_outwork, setOutwork] = useState(new Array(outwork.length).fill(false))
  const [chk_group, setGroup] = useState(new Array(group.length).fill(false))
  const [chk_sexual, setSexual] = useState(new Array(sexual.length).fill(false))


  const [checkedItems, setCheckedItems] = useState(new Set())

  const sendSetValue = () => {
    getSetValue(checkedItems)
  }
  
  
  const Issue = (props) =>{
  
    const checkHandler = ({target}) => {
      props.checkedItemHandler(props.name, target.checked, props.key)
      sendSetValue()
    }

    if (props.type == "physics"){
      // setPhysics(!chk_physics[props.key])
      return (
        <div>
          <label>
          <input type = "checkbox" name = {props.name} checked={chk_physics[props.key]} onChange={(e)=>{checkHandler(e); }}/> {props.name}
          </label>
        </div>
      )
    }
    else if (props.type == "lang"){
      // setLang(!chk_lang[props.key])
      return (
        <div>
          <label>
          <input type = "checkbox" name = {props.name} checked={chk_lang[props.key]} onChange={(e)=>{checkHandler(e);}}/> {props.name}
          </label>
        </div>
      )
    }
    else if (props.type == "onwork"){
      setOnwork(!chk_onwork[props.key])
      return (
        <div>
          <label>
          <input type = "checkbox" name = {props.name} checked={chk_onwork[props.key]} onChange={(e)=>checkHandler(e)}/> {props.name}
          </label>
        </div>
      )
    }
    else if (props.type == "outwork"){
      setOutwork(!chk_outwork[props.key])
      return (
        <div>
          <label>
          <input type = "checkbox" name = {props.name} checked={chk_outwork[props.key]} onChange={(e)=>checkHandler(e)}/> {props.name}
          </label>
        </div>
      )
    }
    else if (props.type == "group"){
      setGroup(!chk_group[props.key])
      return (
        <div>
          <label>
          <input type = "checkbox" name = {props.name} checked={chk_group[props.key]} onChange={(e)=>checkHandler(e)}/> {props.name}
          </label>
        </div>
      )
    }
    else if (props.type == "sexual"){
      setSexual(!chk_sexual[props.key])
      return (
        <div>
          <label>
          <input type = "checkbox" name = {props.name} checked={chk_sexual[props.key]} onChange={(e)=>checkHandler(e)}/> {props.name}
          </label>
        </div>
      )
    }

    
  }

  const modal_contents = (type) => {
    

    const checkedItemHandler = (id, isChecked, position) => {
      if (isChecked) {
        checkedItems.add(id)
        setCheckedItems(checkedItems)
        console.log(checkedItems)
        console.log("physics: ",chk_physics)
        console.log("lang: ",chk_lang)
      } else if (!isChecked && checkedItems.has(id)){
        checkedItems.delete(id)
        setCheckedItems(checkedItems)
        console.log(checkedItems)
        console.log("physics_del: ",chk_physics)
        console.log("lang_del: ",chk_lang)
      }
    }

    if (type == "physics"){
      return (
        <>     
          {physics.map((issue, index)=>(
            <Issue key = {index} name = {issue} type = {type} checkedItemHandler={checkedItemHandler}/>
          ))}
          
        </>
      )
    } else if (type == "lang"){
      return (
        <>
          {lang.map((issue, index)=>(
            <Issue key = {index} name = {issue} type = {type} checkedItemHandler={checkedItemHandler}/>
          ))}
          
        </>
      )
    } else if (type == "onwork"){
      return (
        <>
          {onwork.map((issue, index)=>(
            <Issue key = {index} name = {issue} type = {type} checkedItemHandler={checkedItemHandler}/>
          ))}
          
        </>
      )
    } else if (type == "outwork"){
      return (
        <>
          {outwork.map((issue, index)=>(
            <Issue key = {index} name = {issue} type = {type} checkedItemHandler={checkedItemHandler}/>
          ))}
          
        </>
      )
    } else if (type == "group"){
      return (
        <>
          {group.map((issue, index)=>(
            <Issue key = {index} name = {issue} type = {type} checkedItemHandler={checkedItemHandler}/>
          ))}
          
        </>
      )
    } else if (type == "sexual"){
      return (
        <>
          {sexual.map((issue, index)=>(
            <Issue key = {index} name = {issue} type = {type} checkedItemHandler={checkedItemHandler}/>
          ))}
          
        </>
      )
    }
    
  }

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
    type: PropTypes.string,
    getSetValue: PropTypes.func
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