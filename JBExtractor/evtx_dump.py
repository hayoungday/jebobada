#!/usr/bin/env python
#    This file is part of python-evtx.
#
#   Copyright 2012, 2013 Willi Ballenthin <william.ballenthin@mandiant.com>
#                    while at Mandiant <http://www.mandiant.com>
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
#
#   Version v0.1.1
import datetime
from bs4 import BeautifulSoup

import Evtx.Evtx as evtx

def get_eventid(evtId, type):
    # 로그온 이벤트
    if evtId == "528":
        return "로그인 성공"
    elif evtId == "529":
        return "잘못된 이름 및 암호를 사용하여 로그인 시도"
    elif evtId == "531":
        return "잠긴 사용자 이름으로 로그인 시도"
    elif evtId == "533":
        return "로그온을 허용하지 않는 사용자 이름으로 시도"
    elif evtId == "538":
        return "사용자 로그오프"
    elif evtId == "539":
        return "사용자 계정 잠금"
    elif evtId == "540":
        return "네트워크로 로그온 성공"
    elif evtId == "681":
        return "도메인 계정으로 로그인 시도"
    elif evtId == "682":
        return "연결 끊긴 터미널 서비스 세션에 사용자가 다시 연결"
    elif evtId == "683":
        return "사용자가 로그오프 하지 않고 터미널 서비스 세션과 연결 종료"
    elif evtId == "4624":
        if type == "0":
            return "시스템 시작 시와 같은 시스템 계정에서만 사용"
        elif type == "2":
            return "사용자가 로그온함"
        elif type == "10":
            return "사용자가 원격으로 로그온함"
        else:
            return -1

    elif evtId == "4625":
        return "계정에 로그온하지 못함"
        
    # 시스템 이벤트
    elif evtId == "512":
        return "윈도우 시작"
    elif evtId == "513":
        return "윈도우 종료"
    elif evtId == "4608":
        return "윈도우 시작중"
    elif evtId == "4609":
        return "윈도우 종료됨"

        # 외부 저장 장치
    elif evtId == "6416":
        return "시스템에서 새 외부 장치를 인식함"
    elif evtId == "6419":
        return "장치를 비활성화하도록 요청"
    elif evtId == "6420":
        return "장치 비활성화"
    elif evtId == "6421":
        return "장치 비활성화 요청"
    elif evtId == "6422":
        return "장치 활성화"
    elif evtId == "6423":
        return "시스템 정책에 의해 설치 금지"
    elif evtId == "6424":
        return "정책에 의해 설치 금지된 후 허용됨"
        
        # 원격 데스크톱
    elif evtId == "5712": # "RPC(원격 프로시저 호출)을 시도"
        return "원격 접속 시도"
    elif evtId == "1149": # "RDP 네트워크 성공적으로 연결 (사용자 인증 성공)"
        return "원격 접속 연결 성공"
    elif evtId == "21": # "세션 로그온 성공"
        return "컴퓨터 로그온 성공"
    elif evtId == "22":
        return "셸 시작 알림 받음"
    elif evtId == "23": # "세션 로그오프 성공"
        return "컴퓨터 로그오프 성공"
    elif evtId == "24": # "세션 연결 끊김"
        return "컴퓨터 연결 끊김"
    elif evtId == "25": # "세션 다시 연결 성공"
        return "컴퓨터 다시 연결 성공"
    else:
        return -1

def get_log(xml_file):
    soup = BeautifulSoup(xml_file, "html.parser")
    log = []

    id = get_eventid(soup.find('eventid').string, soup.find('version').string)

    if id != -1:
        for element in soup.findAll("timecreated"):
            log.append(element['systemtime'])
            try:
                log.append(datetime.datetime.strptime(element['systemtime'], '%Y-%m-%d %H:%M:%S.%f').timestamp())
            except:
                log.append(datetime.datetime.strptime(element['systemtime'], '%Y-%m-%d %H:%M:%S').timestamp())
            
        log.append(id)
        log.append(soup.find('eventid').string)
    
    else:
        return None

    return log

def evtxParse(start, end):
    setup_evtx_path = "C:\\Windows\\System32\\winevt\\Logs\\Setup.evtx"
    application_evtx_path = "C:\\Windows\\System32\\winevt\\Logs\\Application.evtx"
    security_evtx_path = "C:\\Windows\\System32\\winevt\\Logs\\Security.evtx"
    system_evtx_path = "C:\\Windows\\System32\\winevt\\Logs\\System.evtx"

    list = []

    with evtx.Evtx(setup_evtx_path) as log:
        for record in log.records():
            tmp = get_log(record.xml())
            if tmp != None:
                if tmp[1] >= start and tmp[1] <= end:
                    list.append(tmp)
    
    with evtx.Evtx(application_evtx_path) as log:
        for record in log.records():
            tmp = get_log(record.xml())
            if tmp != None:
                if tmp[1] >= start and tmp[1] <= end:
                    list.append(tmp)

    with evtx.Evtx(security_evtx_path) as log:
        for record in log.records():
            tmp = get_log(record.xml())
            if tmp != None:
                if tmp[1] >= start and tmp[1] <= end:
                    list.append(tmp)

    with evtx.Evtx(system_evtx_path) as log:
        for record in log.records():
            tmp = get_log(record.xml())
            if tmp != None:
                if tmp[1] >= start and tmp[1] <= end:
                    list.append(tmp)

    return list



