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
import os
import sys
from bs4 import BeautifulSoup

from genericpath import exists
import Evtx.Evtx as evtx
import Evtx.Views as e_views


def get_systemtime(soup):
    for element in soup.findAll("timecreated"):
        print(element['systemtime'])

def get_eventid(soup):
    for element in soup.findAll("eventid"):
        evtId = element.get_text()
        # 로그온 이벤트
        if evtId == "528":
            print("로그인 성공")
        elif evtId == "529":
            print("잘못된 이름 및 암호를 사용하여 로그인 시도")
        elif evtId == "531":
            print("잠긴 사용자 이름으로 로그인 시도")
        elif evtId == "533":
            print("로그온을 허용하지 않는 사용자 이름으로 시도")
        elif evtId == "538":
            print("사용자 로그오프")
        elif evtId == "539":
            print("사용자 계정 잠금")
        elif evtId == "540":
            print("네트워크로 로그온 성공")
        elif evtId == "681":
            print("도메인 계정으로 로그인 시도")
        elif evtId == "682":
            print("연결 끊긴 터미널 서비스 세션에 사용자가 다시 연결")
        elif evtId == "683":
            print("사용자가 로그오프 하지 않고 터미널 서비스 세션과 연결 종료")
        elif evtId == "4624":
            print("계정이 성공적으로 로그온")
        elif evtId == "4625":
            print("계정에 로그온하지 못함")
        
        # 시스템 이벤트
        elif evtId == "512":
            print("윈도우 시작")
        elif evtId == "513":
            print("윈도우 종료")
        elif evtId == "4608":
            print("윈도우 시작중")
        elif evtId == "4609":
            print("윈도우 종료됨")

        # 외부 저장 장치
        elif evtId == "6416":
            print("시스템에서 새 외부 장치를 인식함")
        elif evtId == "6419":
            print("장치를 비활성화하도록 요청")
        elif evtId == "6420":
            print("장치 비활성화")
        elif evtId == "6421":
            print("장치 비활성화 요청")
        elif evtId == "6422":
            print("장치 활성화")
        elif evtId == "6423":
            print("시스템 정책에 의해 설치 금지")
        elif evtId == "6424":
            print("정책에 의해 설치 금지된 후 허용됨")
        
        # 원격 데스크톱
        elif evtId == "5712":
            print("RPC(원격 프로시저 호출)을 시도")
        elif evtId == "1149":
            print("RDP 네트워크 성공적으로 연결 (사용자 인증 성공)")
        elif evtId == "21":
            print("세션 로그온 성공")
        elif evtId == "22":
            print("셸 시작 알림 받음")
        elif evtId == "23":
            print("세션 로그오프 성공")
        elif evtId == "24":
            print("세션 연결 끊김")
        elif evtId == "25":
            print("세션 다시 연결 성공")
        else:
            pass

def get_log(dir_path, xml_file):
    with open(dir_path + xml_file, "r") as fd:
        soup = BeautifulSoup(fd, "html.parser")
    
    return soup

def evtxParse():
    setup_evtx_path = "C:\\Windows\\System32\\winevt\\Logs\\Setup.evtx"
    application_evtx_path = "C:\\Windows\\System32\\winevt\\Logs\\Application.evtx"
    security_evtx_path = "C:\\Windows\\System32\\winevt\\Logs\\Security.evtx"
    system_evtx_path = "C:\\Windows\\System32\\winevt\\Logs\\System.evtx"

    list = []

    with evtx.Evtx(setup_evtx_path) as log:
        for record in log.records():
            list.append(record.xml())
        
    with evtx.Evtx(application_evtx_path) as log:
        for record in log.records():
            list.append(record.xml())

    with evtx.Evtx(security_evtx_path) as log:
        for record in log.records():
            list.append(record.xml())

    with evtx.Evtx(system_evtx_path) as log:
        for record in log.records():
            list.append(record.xml())

    return list



