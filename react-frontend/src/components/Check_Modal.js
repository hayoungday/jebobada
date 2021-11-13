import React, { Component, useState, List } from 'react';
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'

const physics = ["폭행"]
const lang = ["폭언","모욕","협박","비하"]
const onwork = ["무시","정보차단","차단","배제","사적지시","전가","업무제외","SNS","초과근무","건의","감시","사직종용","제출강요","차별","사비"]
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
        <div className="flex-column-container-agree">
          <span className="type-modal-title">괴롭힘 유형 선택</span><br/>
          <div className="flex-container-type-modal">
            <span className="type-modal-subtitle">신체적 괴롭힘</span>
            <img className="qna-icon" data-tip data-for="physics" src="./static/react/questionmark.png"/>
          </div>
          <div className="type-chkbox">
              {physics.map((issue, index)=>(
                <Issue key = {index} name = {issue} type = {type} checkedItemHandler={checkedItemHandler}/>
              ))}
          </div>
          
          <button className="type-modal-confirm-button">확인</button>

          <ReactTooltip id="physics" place="top" effect="solid">
          - 폭행 : 물건을 던지거나 책상을 치는 등 신체적인 위협이나 폭력을 가하는 행위<br/>
          </ReactTooltip>
        </div>
      )
    } else if (type == "lang"){
      return (
        <div>
        <img data-tip data-for="lang" src="./static/react/questionmark.png"/>
          {lang.map((issue, index)=>(
            <Issue key = {index} name = {issue} type = {type} checkedItemHandler={checkedItemHandler}/>
          ))}
        <ReactTooltip id="lang" place="top" effect="solid">
        - 폭언 : 욕설이나 폭언 등 위협 또는 모욕적인 언행을 하는 행위<br/>
        - 모욕 : 다른 직원들 앞 또는 온라인상에서 모욕감을 주는 행위<br/>
        - 협박 : 업무상 불이익을 주겠다며 협박하는 행위<br/>
        - 비하 : 외모, 연령, 학력, 지역, 성별, 비정규직 등을 이유로 인격을 비하하는 행위<br/>
        </ReactTooltip>
        </div>
      )
    } else if (type == "onwork"){
      return (
        <div>
        <img data-tip data-for="onwork" src="./static/react/questionmark.png"/>
          {onwork.map((issue, index)=>(
            <Issue key = {index} name = {issue} type = {type} checkedItemHandler={checkedItemHandler}/>
          ))}
        <ReactTooltip id="onwork" place="top" effect="solid">
        - 무시 : 업무나 인간관계 등에 대해 무시하거나 비아냥거리는 행위<br/>
        - 정보차단 : 합당한 이유 없이 특정정보에 접근, 전달하지 못하게 하는 행위<br/>
        - 차단 : 비품을 주지 않거나, 인터넷, 사내 네트워크 접속을 차단하는 행위<br/>
        - 배제 : 업무와 관련된 중요한 정보나 의사결정 과정에서 배제하는 행위<br/>
        - 사적지시 : 업무와 무관한 사적인 일을 지시하는 행위<br/>
        - 전가 : 본인 업무를 부하 직원에게 반복적으로 전가하는 행위<br/>
        - 업무제외 : 허드렛일만 시키거나 업무를 주지 않는 행위<br/>
        - SNS : 업무시간 이외에 전화나 온라인으로 업무를 지시하는 행위<br/>
        - 초과 근무 : 야근이나 주말 출근을 강요하는 행위<br/>
        - 건의 : 정당한 건의사항이나 의견을 무시하는 행위<br/>
        - 감시 : 일하거나 휴식하는 모습을 감시하는 행위<br/>
        - 사직종용 : 업무상 차별, 불이익 등을 동반하는 행위<br/>
        - 제출 강요 : 적정범위를 넘거나 차별적으로 경위서, 시말서, 반성문, 일일업무보고를 쓰게 하거나, <br/>업무상 필요성이 없는 독후감을 쓰게 하는 행위<br/>
        - 차별 : 훈련, 승진, 보상, 일상적인 대우 등에서 차별하는 행위<br/>
        - 사비 : 회사 용품을 개인 돈으로 사게 하는 행위<br/>
        </ReactTooltip>
        </div>
      )
    } else if (type == "outwork"){
      return (
        <div>
        <img data-tip data-for="outwork" src="./static/react/questionmark.png"/>
          {outwork.map((issue, index)=>(
            <Issue key = {index} name = {issue} type = {type} checkedItemHandler={checkedItemHandler}/>
          ))}
        <ReactTooltip id="outwork" place="top" effect="solid">
        - 행사 : 체육행사, 단합대회 등 비업무적인 행사를 강요하는 행위<br/>
        - 장기자랑 강요 : 장기자랑을 강요하는 행위<br/>
        - 강요 : 회식, 음주, 흡연 또는 금연을 강요<br/>
        - 후원 강요 : 특정 종교나 단체의 활동 또는 후원을 요구하는 행위<br/>
        - 휴가 : 휴가나 병가, 각종 복지혜택 등을 쓰지 못하도록 압력을 주는 행위<br/>
        - 육아휴직 : 육아휴직을 쓰지 못하게 하거나 비하하는 행위<br/>
        - 모임 : 동호회나 모임을 만들지 못하게 하거나 강제로 가입시키는 행위<br/>
        - 실업급여 : 권고사직 확인 등 구직급여 절차에 협조하지 않는 행위<br/>
        </ReactTooltip>
          
        </div>
      )
    } else if (type == "group"){
      return (
        <div>
        <img data-tip data-for="group" src="./static/react/questionmark.png"/>
          {group.map((issue, index)=>(
            <Issue key = {index} name = {issue} type = {type} checkedItemHandler={checkedItemHandler}/>
          ))}
        <ReactTooltip id="group" place="top" effect="solid">
        - 따돌림 : 상사나 다수의 직원이 특정한 직원을 따돌리는 행위<br/>
        - 소문 : 개인 사생활에 대한 뒷담화나 소문, 허위사실 등을 퍼뜨리는 행위<br/>
        - 비밀 : 의사에 반해 직장 내 괴롭힘을 신고한 제보자의 신원을 공개하는 행위<br/>
        - 태움 : 업무를 가르치면서 학습능력 부족 등을 이유로 괴롭히는 행위<br/>
        </ReactTooltip>
        </div>
      )
    } else if (type == "sexual"){
      return (
        <div>
          <img data-tip data-for="sexual" src="./static/react/questionmark.png"/>
          {sexual.map((issue, index)=>(
            <Issue key = {index} name = {issue} type = {type} checkedItemHandler={checkedItemHandler}/>
          ))}
          <ReactTooltip id="sexual" place="top" effect="solid">
          - 성희롱 : 성적 수치심을 주며 피해를 입히는 행위<br/>
          </ReactTooltip>
          
        </div>
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
    background-color: #fff;
    border-radius: 50px;
    width: 1000px;
    height: 720px;
    top: 50%;
    transform: translateY(-50%);
    margin: 0 auto;
    padding: 40px 20px;
  `

export default Check_Modal;