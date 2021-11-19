import datetime
import os
from bs4 import BeautifulSoup

import subprocess
import Evtx.Evtx as evtx

def get_eventid(soup):

    evtId = soup.find('eventid').string
    
    # 시스템 시작/종료 - system.evtx
    if evtId == "12" or evtId == "13" or evtId == "14":
        if evtId == "12":
            item = "컴퓨터 시작"
        elif evtId == "13":
            item = "컴퓨터 종료"
        elif evtId == "1074":
            item = "컴퓨터 다시시작"
        
        provider = soup.find('provider')['name']

        if provider == "Microsoft-Windows-Kernel-General" or provider == "User32":
            return item
    
    # 절절 모드 - system.evtx
    if evtId == "42" or evtId == "1":
        if evtId == "42":
            item = "절전 모드 전환"
        else:
            item = "절전 모드 해제"
    
        SID = soup.find('security')['userid']

        if SID == subprocess.check_output('whoami /user').split()[-1].decode():
            return item

    # 로그온 이벤트 - security.evtx
    if evtId == "538" or evtId == "4647" or evtId == "528" or evtId == "4624" or evtId == "529" or evtId == "4625":
        item = -1
        if evtId == "538" or evtId == "4647":
            item = "컴퓨터 로그오프"
        elif evtId == "528" or evtId == "4624":
            for element in soup.findAll('data'):
                if element['name'] == "TargetUserName":
                    if element.string == os.getlogin():
                        item = "컴퓨터 로그인 성공"
        else:
            item = "컴퓨터 로그인 실패"

        return item
    
    # 시스템 이벤트 - security.evtx
    if evtId == "512" or evtId == "4608" or evtId == "513" or evtId == "4609" or evtId == "4723":
        if evtId == "512" or evtId == "4608":
            item = "윈도우 시작"
        elif evtId == "513" or evtId == "4609":
            item = "윈도우 종료"
        elif evtId == "4723":
            item = "계정 암호 변경"
    
        return item
    

    """
    # 외부 저장 장치 - system.evtx
    if evtId == "6416":
        return "컴퓨터에서 새 외부 장치를 인식"
    elif evtId == "6420":
        return "외부 장치 비활성화"
    elif evtId == "6422":
        return "외부 장치 활성화"
    elif evtId == "10000":
        return "드라이버 패키지를 장치에 설치"
    elif evtId == "100100":
        return "드라이버 패키지 설치 완료"
    elif evtId == "20001":
        return "드라이버 설치 프로세스 끝냄"
    elif evtId == "24576":
        return "외장저장장치 처음 연결"
    elif evtId == "24577":
        return "외장저장장치 처음 연결"
    elif evtId == "24579":
        return "외장저장장치 처음 연결"
    
    return -1
    
    """
    
    # 원격 데스크톱 - Microsoft-Windows-TerminalServices-LocalSessionManager%4Operational.evtx
    if evtId == "21" or evtId == "23" or evtId == "24" or evtId == "25" or evtId == "40":
        if evtId == "21":
            item = "원격 컴퓨터 로그온"
        elif evtId == "23":
            item = "원격 컴퓨터 로그오프"
        elif evtId == "24" or evtId == "40":
            item = "원격 컴퓨터 연결 끊김"
        else:
            item = "원격 컴퓨터 다시 연결 성공"

    return -1

def get_log(xml_file):
    soup = BeautifulSoup(xml_file, "html.parser")
    log = []

    id = get_eventid(soup)


    if id != -1:
        element = soup.find("timecreated")['systemtime']
        log.append(element)

        try:        
            log.append(datetime.datetime.strptime(element, '%Y-%m-%d %H:%M:%S.%f').timestamp())
        except:
            log.append(datetime.datetime.strptime(element, '%Y-%m-%d %H:%M:%S').timestamp())

        log.append(id)
        log.append(soup.find('eventid').string)
    
    else:
        return None

    return log