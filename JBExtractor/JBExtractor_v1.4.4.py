import os
import sys
import datetime
import webbrowser
import hashlib
import re

from PyQt5 import uic
from PyQt5 import QtCore
from PyQt5 import QtGui
from PyQt5.QtCore import QByteArray, QTimer, QDateTime
from PyQt5.QtWidgets import *
from PyQt5.QtGui import *

from windowsprefetch import Prefetch
from JLParser import JumpList
from recycleParser import Recycle
from browser_history import get_history
import winactivities2json
import psevt
import psusb

# Get absolute path to resource, works for dev and for PyInstaller
def resource_path(relative_path):
    base_path = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_path, relative_path)

# UI Setting
form = resource_path('JBExtractor_v1.4.4.ui')
form_mainWindow = uic.loadUiType(form)[0]
form_loading = resource_path('jb_loading.ui')
form_loadingWidget = uic.loadUiType(form_loading)[0]
form_help = resource_path('jb_help.ui')
form_helpDialog = uic.loadUiType(form_help)[0]
form_warning_step1_1 = resource_path('jb_warning_step1_1.ui')
form_warningDialog_step1_1 = uic.loadUiType(form_warning_step1_1)[0]
form_warning_step1_2 = resource_path('jb_warning_step1_2.ui')
form_warningDialog_step1_2 = uic.loadUiType(form_warning_step1_2)[0]
form_warning_step1_3 = resource_path('jb_warning_step1_3.ui')
form_warningDialog_step1_3 = uic.loadUiType(form_warning_step1_3)[0]
form_warning_step1_4 = resource_path('jb_warning_step1_4.ui')
form_warningDialog_step1_4 = uic.loadUiType(form_warning_step1_4)[0]
form_warning_step3 = resource_path('jb_warning_step3.ui')
form_warningDialog_step3 = uic.loadUiType(form_warning_step3)[0]
form_info_aboutus = resource_path('jb_info_aboutus.ui')
form_infoDialog = uic.loadUiType(form_info_aboutus)[0]
form_info_save = resource_path('jb_info_save.ui')
form_infoDialog_step3_1 = uic.loadUiType(form_info_save)[0]
form_info_error = resource_path('jb_info_error.ui')
form_infoDialog_step3_2 = uic.loadUiType(form_info_error)[0]

# Main Window
class MainWindow(QMainWindow, form_mainWindow):
    def __init__(self):
        super().__init__()
        self.initUI()
        self.show()
    
    def initUI(self):
        # Setting loaded UI
        self.setupUi(self)
        self.setWindowFlag(QtCore.Qt.FramelessWindowHint)
        self.setAttribute(QtCore.Qt.WA_TranslucentBackground)
        self.setWindowIcon(QtGui.QIcon(resource_path('JBExtract_icon.ico')))

        self.m_flag = False

    #------------------------------------------------------------------------------#
        # Signal of main screen
        self.nextBtn_main.clicked.connect(self.nextBtnClick)
        self.exitBtn_main.clicked.connect(self.exitBtnClick)
        self.minBtn_main.clicked.connect(self.showMinimized)
        self.homeBtn_main.clicked.connect(self.homeBtnClick)
        self.downMenuBtn_main.clicked.connect(self.downMenuClick)
        self.helpBtn_main.clicked.connect(self.helpBtnClick)
        self.infoBtn_main.clicked.connect(self.infoBtnClick)
        self.internetBtn_main.clicked.connect(lambda: webbrowser.open('http://218.146.20.51:20080/main'))

    #------------------------------------------------------------------------------#
        # Signal of step1 screen
        self.nextBtn_step1.clicked.connect(self.nextBtnClick_step1)
        self.backBtn_step1.clicked.connect(self.backBtnClick)
        self.backBtn_step1_2.clicked.connect(self.backBtnClick)
        self.exitBtn_step1.clicked.connect(self.exitBtnClick)
        self.minBtn_step1.clicked.connect(self.showMinimized)
        self.helpBtn_step1.clicked.connect(self.helpBtn_step1Click)
        self.infoBtn_step1.clicked.connect(self.infoBtnClick)
        self.homeBtn_step1.clicked.connect(self.homeBtnClick)
        self.downMenuBtn_step1.clicked.connect(self.downMenuClick)
        self.internetBtn_step1.clicked.connect(lambda: webbrowser.open('http://218.146.20.51:20080/main'))

        today_time = datetime.datetime.strftime(datetime.datetime.today(), '%Y년 %m월 %d일 %p %I:%M')
        year, month, day, ap, day_time = today_time.split(' ')
        if ap == "AM":
            self.todayLine_step1.setText(year + " " + month + " " + day + " 오전 " + day_time)
        else:
            self.todayLine_step1.setText(year + " " + month + " " + day + " 오후 " + day_time)

        self.startDate_step1.setDateTime(QDateTime.currentDateTime())
        self.endDate_step1.setDateTime(QDateTime.currentDateTime())

        self.addDateBtn_step1.clicked.connect(self.addDateBtnClick)
        self.delDateBtn_step1.clicked.connect(self.delDateBtnClick)
        self.reloadBtn_step1.clicked.connect(self.reloadBtnClick)

        self.userDate = []

        self.comboBox_step1.activated[str].connect(lambda: self.selectComboItem(self.comboBox_step1))

    #------------------------------------------------------------------------------#
        # Signal of step2 screen
        self.nextBtn_step2.clicked.connect(self.nextBtnClick)
        self.backBtn_step2.clicked.connect(self.backBtnClick)
        self.backBtn_step2_2.clicked.connect(self.backBtnClick)
        self.exitBtn_step2.clicked.connect(self.exitBtnClick)
        self.minBtn_step2.clicked.connect(self.showMinimized)
        self.helpBtn_step2.clicked.connect(self.helpBtn_step2Click)
        self.infoBtn_step2.clicked.connect(self.infoBtnClick)
        self.homeBtn_step2.clicked.connect(self.homeBtnClick)
        self.downMenuBtn_step2.clicked.connect(self.downMenuClick)
        self.internetBtn_step2.clicked.connect(lambda: webbrowser.open('http://218.146.20.51:20080/main'))

        self.extractBtn_step2.clicked.connect(self.startExtractClick)
        #self.extractBtn_step2.clicked.connect(self.loading)

        self.result = []
        self.completeCnt = 0

    #------------------------------------------------------------------------------#
        # Sigal of step3 screen
        self.nextBtn_step3.clicked.connect(self.nextBtnClick)
        self.backBtn_step3.clicked.connect(self.backBtnClick)
        self.backBtn_step3_2.clicked.connect(self.backBtnClick)
        self.exitBtn_step3.clicked.connect(self.exitBtnClick)
        self.minBtn_step3.clicked.connect(self.showMinimized)
        self.helpBtn_step3.clicked.connect(self.helpBtn_step3Click)
        self.infoBtn_step4.clicked.connect(self.infoBtnClick)
        self.homeBtn_step3.clicked.connect(self.homeBtnClick)
        self.downMenuBtn_step3.clicked.connect(self.downMenuClick)
        self.internetBtn_step3.clicked.connect(lambda: webbrowser.open('http://218.146.20.51:20080/main'))

        self.downAnalysisBtn_step3.clicked.connect(self.downAnalysisBtnClick)

        self.doc_cnt = 0
        self.exe_cnt = 0
        self.web_cnt = 0
        self.usb_cnt = 0
        self.evt_cnt = 0
        self.recycle_cnt = 0

    #------------------------------------------------------------------------------#
        # Signal of step4 screen
        self.backBtn_step4.clicked.connect(self.backBtnClick)
        self.backBtn_step4_2.clicked.connect(self.backBtnClick)
        self.exitBtn_step4.clicked.connect(self.exitBtnClick)
        self.minBtn_step4.clicked.connect(self.showMinimized)
        self.infoBtn_step4.clicked.connect(self.infoBtnClick)
        self.homeBtn_step4.clicked.connect(self.homeBtnClick)
        self.homeBtn_step4_2.clicked.connect(self.homeBtnClick)
        self.downMenuBtn_step4.clicked.connect(self.downMenuClick)
        self.internetBtn_step4.clicked.connect(lambda: webbrowser.open('http://218.146.20.51:20080/main'))

        self.uploadBtn_step4.clicked.connect(lambda: webbrowser.open('http://218.146.20.51:20080/main'))
        


    def nextBtnClick(self):
        index = self.stackedWidget.currentIndex()
        self.stackedWidget.setCurrentIndex((index + 1))

        try:
            self.help.stackedWidget_help.setCurrentIndex((index + 1))
            if index != 2:
                self.help.raise_()
        except:
            pass


    def nextBtnClick_step1(self):
        if self.dateList_step1.count() == 0:
            self.warning_step1_2 = warningDialog_step1_2()
        else:
            index = self.stackedWidget.currentIndex()
            self.stackedWidget.setCurrentIndex((index + 1))
        
        try:
            self.help.stackedWidget_help.setCurrentIndex((index + 1))
        except:
            pass


    def backBtnClick(self):
        index = self.stackedWidget.currentIndex()
        self.stackedWidget.setCurrentIndex((index - 1))

        try:
            self.help.stackedWidget_help.setCurrentIndex((index - 1))
            self.help.raise_()
        except:
            pass

    def exitBtnClick(self):
        self.close()


    def homeBtnClick(self):
        self.stackedWidget.setCurrentIndex(0)

        try:
            self.help.stackedWidget_help.setCurrentIndex(0)
        except:
            pass


    def downMenuClick(self):
        self.stackedWidget.setCurrentIndex(3)

        try:
            self.help.stackedWidget_help.setCurrentIndex(3)
        except:
            pass


    def helpBtnClick(self):
        self.help = helpDialog()

    def reloadBtnClick(self):
        self.startDate_step1.setDateTime(QDateTime.currentDateTime())
        self.endDate_step1.setDateTime(QDateTime.currentDateTime())
        self.comboBox_step1.setCurrentIndex(0)

        for r in range(self.dateList_step1.count() - 1, -1, -1):
            self.dateList_step1.takeItem(r)

        self.userDate = []

    def loading(self):
        self.loading = loading(self)
    
    def func_prefetch(self):
        prefetch_path = "C:\\Windows\\Prefetch"

        # Not showing these programs in csv file
        basic_program = ["APPLICATIONFRAMEHOST.EXE",            # Windows 10 스토어 플랫폼 앱
                            "AUDIODG.EXE",                          # Windows 오디오 장치 그래픽 오디오 엔진
                            "BACKGROUNDTASKHOST.EXE",               # 백그라운드 작업 호스트 유틸리티 실행
                            "CONHOST.EXE",                          # 콘솔 Windows 호스트 프로세스
                            "CONSENT.EXE",                          # Windows 인증 레이어 UAC에 대한 사용자 인터페이스
                            "DLLHOST.EXE",                          # DLL 라이브러리 파일을 사용하는 프로그램 관리
                            "FILECOAUTH.EXE",                       # Microsoft OneDrive 소프트웨어 일부
                            "GAMEBAR.EXE",                          # Xbox 게임 오버레이 (녹화, 스크린샷, 마이크)
                            "HELPPANE.EXE",                         # Windows 지원 플랫폼 클라이언트
                            "INDEX.EXE",                            # Microsoft Office Home 소프트웨어 일부
                            "MOUSOCOREWORKER.EXE",                  # 새로운 Windows 업데이트가 있는지 확인
                            "MSCORSVW.EXE",                         # Windows pre-compiling 서비스
                            "NGEN.EXE",                             # 네이티브 이미지 생성기
                            "NGENTASK.EXE",                         # 네이티브 이미지 생성기 작업
                            "RUNTIMEBROKER.EXE",                    # Windows 스토어/모던 앱 관리
                            "SVCHOST.EXE",                          # Win32 서비스 처리 호스트 프로세스
                            "TASKHOSTW.EXE",                        # Windows 작업용 호스트 프로세스
                            "TASKMGR.EXE",                          # Windows 작업 관리자 실행
                            "TIWORKER.EXE",                         # 하드웨어 및 소프트웨어 최적화, 드라이버 업데이트
                            "WERFAULT.EXE",                         # Microsoft 시스템 에러 리포팅 서비스
                            "WMIPRVSE.EXE",                         # WMI 용 Microsoft 공급자 호스트 서비스
                            "SPPSVC.EXE",                           # Microsoft 소프트웨어 플랫폼 보호 서비스
                            "MPCMDRUN.EXE",                         # Microsoft 멀웨어 방지 명령 줄 유틸리티
                            "SCHTASKS.EXE",                         # 작업 스케줄러
                            "SIHCLIENT.EXE",                        # 자동 Windows 업데이트 클라이언트
                            "WUDFHOST.EXE",                         # Windows 하드웨어 장치 용 통신 에이전트
                            "RUNDLL32.EXE",                         # DLL 파일을 다른 응용 프로그램에서 실행
                            "SHELLEXPERIENCEHOST.EXE",              # 범용 응용 프로그램을 Windows 쉘과 통합
                            "SEARCHAPP.EXE",                        # Cortana 내부에서 실행하는 검색 도구
                            "TEXTINPUTHOST.EXE",                    # Windows 10 받아쓰기 기능
                            "SIHOST.EXE",                           # 쉘 인프라 호스트
                            "STARTMENUEXPERIENCEHOST.EXE",          # 시작메뉴 호스트
                            "VIDEO.UI.EXE",                         # XBox Live 엔터테인먼트 플랫폼 소프트웨어 구성 요소
                            "PICKERHOST.EXE",                       # 파일 선택 UI 호스트
                            "OPENWITH.EXE",                         # 응용 프로그램 선택 프로세스
                            "MSIEXEC.EXE",                          # Windows 인스톨러
                            "MMC.EXE",                              # Microsoft 관리 콘솔 구성 요소
                            "SPLWOW64.EXE",                         # 프린터 드라이버 호스트
                            "SEARCHPROTOCOLHOST.EXE",               # Windows 인덱싱 검색 서비스 일부
                            "SEARCHFILTERHOST.EXE",                 # Windows 인덱싱 프로그램 일부
                            "NISSRV.EXE",                           # 네트워크 실시간 검사 서비스
                            "OFFICESVCMGR.EXE",                     # Microsoft Office Serviceability Manager
                            "QUICKSEARCH.EXE",                      # Glarysoft QuickSearch 프로세스
                            "SDXHELPER.EXE",                        # Microsoft Office SDX 도우미
                            "SYSTEMSETTINGS.EXE",                   # PC 설정
                            "TRUSTEDINSTALLER.EXE",                 # Windows 모듈 설치 관리자
                            "UPFC.EXE",                             # Updateability From SCM
                            "USOCLIENT.EXE",                        # Windows 업데이트 (검색, 설치, 다시 시작)
                            "WUAPIHOST.EXE",                        # Wuapi.dll 호스팅 파일 (Windows Update Client API)
                            "WUAUCLT.EXE",                          # Windows 운영체제 용 소프트웨어 업데이트 유틸리티
                            "LOCKAPP.EXE",                          # 로그인 전에 나타나는 잠금화면 오버레이
                            "BACKGROUNDTRANSFERHOST.EXE",           # Windows 앱에서 백그라운드 또는 데이터를 다운로드/업로드
                            "COMPATTELRUNNER.EXE",                  # Windows7에서 Windows10으로 넘어가는 설치의 호환성 검사 및 보고
                            "CVTRES.EXE",                           # Microsoft 리소스 파일 COFF 개체 변환 유틸리티
                            "ICACLS.EXE",                           # Windows Server 2003 용 명령 줄 유틸리티
                            "LAUNCHTM.EXE",                         # Windows 고급 작업 관리자
                            "MPSIGSTUB.EXE",                        # Windows 자동 업데이트와 함께 사용되는 설치 응용 프로그램
                            "OFFICECLICKTORUN.EXE",                 # Office 제품 관련 업데이트 관리
                            "SECURITYHEALTHHOST.EXE",               # Windows 보안 상태 서비스
                            "VSSVC.EXE",                            # 볼륨의 스냅 샷을 백업할 수 있는 백업 유틸리티
                            "BYTECODEGENERATOR.EXE",                # AppX Deployment Bytecode Generator EXE
                            "DEFRAG.EXE",                           # Windows 디스크 조각 모음
                            "DISMHOST.EXE",                         # Windows 이미지 서비스 및 준비를 위한 명령 줄 도구
                            "DRVINST.EXE",                          # 하드웨어 장치와 OS 또는 응용 프로그램 간에 통신 생성
                            "DSMUSERTASK.EXE",                      # Device Setup Manager User Task Handler
                            "FILESYNCCONFIG.EXE",                   # Cisco VPN Client Fix
                            "FODHELPER.EXE",                        # Bridges Microsoft Office network connections
                            "FSQUIRT.EXE",                          # Bluetooth 파일 전송 마법사 GUI 실행
                            "LOCALBRIDGE.EXE",                      # 잘못된 이미지, 바이너리 코드 손상 오류
                            "MOBSYNC.EXE",                          # Microsoft Sync Center
                            "MRT.EXE",                              # Windows 자체적으로 악성코드를 제거
                            "MSDTC.EXE",                            # Microsoft Distributed Transaction Corrdinator Service
                            "SEARCHINDEXER.EXE",                    # 파일을 미리 검색하고 색인하는 Windows 서비스
                            "SECURITYHEALTHSERVICE.EXE",            # Windows 보안 상태 서비스
                            "SETTINGSYNCHOST.EXE",                  # 동기화 호스트 설정 프로그램
                            "SPPEXTCOMOBJ.EXE",                     # Windows 코어 시스템 파일
                            "VERCLSID.EXE",                         # Windows 탐색기로 표시되기 전에 COM 개체 확인
                            "WERMGR.EXE",                           # Microft 서명 파일
                            "WIMSERV.EXE",                          # Windows의 디스크 이미징 유틸리티
                            "WLRMDR.EXE",                           # Windows 로그온 알림
                            "WMIADAP.EXE",                          # WMI 레파지토리에서 성능정보 업데이트
                            "WOWREG32.EXE",                         # SetupAPI 32-bit Surrogate 
                            "WWAHOST.EXE",                          # Windows 스토어 앱을 호스트하고 실행
                            "WLANEXT.EXE",                          # Windows 프레임 워크 실행
                            "SYSTEMSETTINGSADMINFLOWS.EXE",         # 파일 열기, 수정, 삭제에 필요한 관리자 권한 담당
                            "SYSTEMPROPERTIESADVANCED.EXE",         # Microsoft 시스템 고급설정 변경 응용 프로그램
                            "SPATIALAUDIOLICENSESRV.EXE",           # 오디오 시스템의 일부
                            "SNDVOL.EXE",                           # 시스템의 볼륨 설정 제어
                            "SMARTSCREEN.EXE",                      # Windows 10 다운로드 된 멀웨어, 악성 웹 사이트로부터 보호
                            "SECHEALTHUI.EXE",                      # Windows Defender 응용 프로그램
                            "SDIAGNHOST.EXE",                       # Scripted Diagostics Native Host를 여는 파일
                            "ONEDRIVE.EXE",                         # One Drive
                            "MAKECAB.EXE",                          # Windows 용 파일 보관 유틸리티
                            "LOGONUI.EXE",                          # 로그온 사용자 인터페이스 관련 파일
                            "EXPLORER.EXE",                         # 파일 탐색기
                            "COMPPKGSRV.EXE",                       # Component Package Support Server
                            "APPVLP.EXE",                           # Microsoft Application Virtualization
                            "AM_DELTA_PATCH",                       # Microsoft 바이러스 백신
                            "MSOASB.EXE",                           # Microsoft Office 2016 Preview
                            "SUENGINE.EXE",                         # 삼성 제품군 시스템 업데이트 관련 프로그램
                            "SAMSUNGSETTINGS.EXE",                  # 삼성 업데이트
                            "MCUIHOST.EXE",                         # McAfee UI Host
                            "MCHOST.EXE",                           # McAfee Total Protection
                            "MCAUTOREG.EXE",                        # McAfee Total Protection
                            "MCUICNT.EXE",                          # McAfee Security Scan Plus
                            "GUP.EXE",                              # Secure KeyStroke for POS, 단말기 보안솔루션
                            "UPDATER.EXE",                          # Internet Explorer Ask Toolbar
                            "GOOGLEUPDATE.EXE",                     # Google 응용 프로그램 업데이트 패키지
                            "MICROSOFTEDGEUPDATE.EXE",              # Microsoft Edge 설치 및 업데이트
                            "CHXSMARTSCREEN.EXE",                   # 특정 파일이 바이러스인지 확인
                            "UN_A.EXE",                             # 안티 멀웨어 Byte Technologies LLC
                            "NPUPDATEC.EXE",                        # nProtect Online Security 키보드 보안
                            "KOSINJ.EXE",                           # 킹스정보통신(주) K-Defense
                            "KOS_UPDATE.EXE",                       # 킹스정보통신 키보드 보안
                            "UNIFIEDINSTALLER.EXE"                  # Update for Windows Update Service
                        ]

        file_paths = []
        parsed_files = []

        for filename in os.listdir(prefetch_path):
            file_paths.append(os.path.join(prefetch_path, filename))

        for filepath in file_paths:
            if filepath.endswith(".pf"):
                if os.path.getsize(filepath) > 0:
                    p = Prefetch(filepath)
                    parsed_files.append(p)

        for p in parsed_files:
            for timestamp in p.timestamps:
                flag = 0
                artifact_timestamp = datetime.datetime.strptime(timestamp, '%Y-%m-%d %H:%M:%S.%f').timestamp()
                artifact_timestamp += 32400

                artifact_date_item = datetime.datetime.fromtimestamp(artifact_timestamp).strftime('%Y-%m-%d/%H:%M:%S')

                for r in range(len(self.dateList)):
                    if artifact_timestamp >= self.dateList[r][0] and artifact_timestamp <= self.dateList[r][1]:
                            flag += 1
                        
                if flag > 0:
                    if p.executableName.upper() not in basic_program and p.executableName not in "Microsoft" and p.executableName[-3:].upper() not in "TMP":
                        self.exe_cnt += 1
                        self.result.append("{},{},{},{},{},{}".format(
                            "프리패치",
                            artifact_date_item,
                            p.executableName,
                            "프로그램 실행",
                            "icon_exec",
                            "사적지시/전가/SNS/초과근무/감시/휴가/육아휴직"
                        ))


        self.label_exe_step3.setText(str(self.exe_cnt) + " 건")
        self.completeCnt += 10
        print("Progressing...(" + str(self.completeCnt) + "%) ==> Prefetch completed")


    def func_jumplist(self):
        jumplist_item = JumpList("C:\\Users\\{}\\AppData\\Roaming\\Microsoft\\Windows\\Recent".format(os.getlogin()))
        jumplist_list = jumplist_item.result.split('\n')

        ext_list = ['docx', 'xlsx', 'xls', 'pptx', 'pdf', 'txt', 'hwp', 'csv']
        label = "배제/사적지시/전가/업무제외/SNS/초과근무/건의/사직종용/제출강요/행사/장기자랑강요/후원강요/휴가/육아휴직/모임/실업급여/성희롱"

        for i in range(1, len(jumplist_list)):
            # "2021-11-12 14:08:14.424491"
            artifact_date_item = jumplist_list[i].split(',')[4]

            if "1700-01-01" not in artifact_date_item:
                flag = 0

                # Epoch Time
                artifact_timestamp = datetime.datetime.strptime(artifact_date_item, '\"%Y-%m-%d %H:%M:%S.%f\"').timestamp()
                artifact_timestamp += 32400

                artifact_date_item = datetime.datetime.fromtimestamp(artifact_timestamp).strftime('%Y-%m-%d/%H:%M:%S')

                # "LNK_File" or "JumpList"
                artifact_type = jumplist_list[i].split(',')[27]

                for r in range(len(self.dateList)):
                    if artifact_timestamp >= self.dateList[r][0] and artifact_timestamp <= self.dateList[r][1]:
                        flag += 1
                    
                if flag > 0:
                    if "LNK_File" in artifact_type:

                        # folder : ["folderName", "lnk"]
                        # file   : ["fileName", "evt", "lnk"]

                        # ex)
                        # artifact_item : "testOutput.csv.lnk"
                        # artifact_item_list : ["testOutput", "csv", "lnk"]
                        # artifact_item_name = testOutput.csv.lnk
                        # artifact_item_ext = csv

                        artifact_item = jumplist_list[i].split(',')[25]
                        artifact_item_list = artifact_item.split('.')
                        artifact_item_name = artifact_item.replace('"','')
                        artifact_item_ext = artifact_item_list[-2].split(' ')[0].lower()

                        # "C:\Users\user\Desktop\testOutput.csv.lnk" -> C:\Users\user\Desktop\testOutput.csv.lnk
                        artifact_item_path = jumplist_list[i].split(',')[14]
                        artifact_item_path = artifact_item_path.replace('"','')

                        # file
                        if len(artifact_item_list) > 2:
                            if artifact_item_ext in ext_list and artifact_item_name not in "CustomDestinations-ms" and artifact_item_name not in "automaticDestinations-ms": 
                                self.result.append("링크 파일" + "," + artifact_date_item + "," + artifact_item_name[:-4] + "," + "문서 열람" + "," + "icon_" + artifact_item_ext + "," + label + "," + artifact_item_path)
                            else:
                                self.result.append("링크 파일" + "," + artifact_date_item + "," + artifact_item_name[:-4] + "," + "파일 열람" + "," + "icon_file" + "," + label + "," + artifact_item_path)
                        # folder
                        else:      
                            self.result.append("링크 파일" + "," + artifact_date_item + "," + artifact_item_name + "," + "폴더 열람" + "," + "icon_folder" + "," + label + "," + artifact_item_path)

                    elif "JumpList" in artifact_type:
                        self.doc_cnt += 1

                        # ex)
                        # artifact_path : "C:\Users\user\Desktop\jumplist.txt"
                        # artifact_path_list : ["C:", "Users", "user", "Desktop", "jumplist.txt"]
                        # artiract_item = "jumplist.txt"
                        # artifact_item_name = jumplist.txt
                        # artifact_item_list = ["jumplist", "txt"]
                        # artifact_item_ext = txt

                        artifact_item_path = jumplist_list[i].split(',')[14]
                        artifact_item_path_list = jumplist_list[i].split(',')[14].split('\\')
                        artifact_item = artifact_item_path_list[-1]
                        artifact_item_name = artifact_item.replace('"', '')
                        artifact_item_list = artifact_item.split('.')
                        artifact_item_ext = artifact_item_list[-1].split(' ')[0].lower().replace('"','')

                        # file
                        if len(artifact_item_list) > 1:
                            if artifact_item_ext in ext_list:
                                self.result.append("점프 리스트" + "," + artifact_date_item + "," + artifact_item_name + "," + "문서 열람" + "," + "icon_" + artifact_item_ext + "," + label + "," + artifact_item_path)
                            else:
                                self.result.append("점프 리스트" + "," + artifact_date_item + "," + artifact_item_name + "," + "파일 열람" + "," + "icon_file" + "," + label + "," + artifact_item_path)
                        # folder
                        else:
                            self.result.append("점프 리스트" + "," + artifact_date_item + "," + artifact_item_name + "," + "폴더 열람" + "," + "icon_folder" + "," + label + "," + artifact_item_path)
        
                    else:
                        pass

        self.label_doc_step3.setText(str(self.doc_cnt) + " 건")
        self.completeCnt += 10
        print("Progressing...(" + str(self.completeCnt) + "%) ==> Jumplist completed")



    def func_recycleBin(self):
        list = Recycle()

        for r in range(len(list)):
            flag = 0
            artifact_timestamp = datetime.datetime.strptime(list[r].split(',')[1], '%Y-%m-%d/%H:%M:%S').timestamp()

            for k in range(len(self.dateList)):
                if artifact_timestamp >= self.dateList[k][0] and artifact_timestamp <= self.dateList[k][1]:
                    flag += 1

            if flag > 0:
                self.recycle_cnt += 1
                self.result.append(list[r])

        self.label_recycle_step3.setText(str(self.recycle_cnt) + " 건")
        self.completeCnt += 10
        print("Progressing...(" + str(self.completeCnt) + "%) ==> RecycleBin completed")



    def func_history(self):
        outputs = get_history()

        label = "사적지시/전가/업무제외/SNS/초과근무/건의/제출강요/행사/장기자랑강요/후원강요/모임/소문/비밀/성희롱"

        for r in range(len(outputs.histories)):
            flag = 0
            # artifact_timestamp (epoch time)
            artifact_timestamp = (outputs.histories[r][0]).timestamp()

            for k in range(len(self.dateList)):
                if artifact_timestamp >= self.dateList[k][0] and artifact_timestamp <= self.dateList[k][1]:
                        flag += 1

            if flag > 0:
                self.web_cnt += 1

                # artifact_date_item (str)
                artifact_date_item = datetime.datetime.fromtimestamp(artifact_timestamp).strftime('%Y-%m-%d/%H:%M:%S')

                artifact_url = outputs.histories[r][1]
                artifact_title = outputs.histories[r][2]
                artifact_title = artifact_title.replace("\"","")
                browser_type = outputs.histories[r][3]
                    
                artifact_title = artifact_title.encode('cp949', errors='ignore').decode('cp949')
                self.result.append("웹 히스토리" + "," + artifact_date_item + ",\"" + artifact_title + "\"," + "웹사이트 방문" + "," + "icon_visit_" + browser_type + "," + label + ",\"" + artifact_url + "\"")
                    
        self.label_web_step3.setText(str(self.web_cnt) + " 건")
        self.completeCnt += 10
        print("Progressing...(" + str(self.completeCnt) + "%) ==> History completed")

    
    def func_activitiesCache(self):
        activitiesCache_list = winactivities2json.activitiesParse()

        label = "사적지시/전가/SNS/초과근무/감시/휴가/육아휴직"

        basic_program = ["APPLICATIONFRAMEHOST.EXE",            # Windows 10 스토어 플랫폼 앱
                            "AUDIODG.EXE",                          # Windows 오디오 장치 그래픽 오디오 엔진
                            "BACKGROUNDTASKHOST.EXE",               # 백그라운드 작업 호스트 유틸리티 실행
                            "CONHOST.EXE",                          # 콘솔 Windows 호스트 프로세스
                            "CONSENT.EXE",                          # Windows 인증 레이어 UAC에 대한 사용자 인터페이스
                            "DLLHOST.EXE",                          # DLL 라이브러리 파일을 사용하는 프로그램 관리
                            "FILECOAUTH.EXE",                       # Microsoft OneDrive 소프트웨어 일부
                            "GAMEBAR.EXE",                          # Xbox 게임 오버레이 (녹화, 스크린샷, 마이크)
                            "HELPPANE.EXE",                         # Windows 지원 플랫폼 클라이언트
                            "INDEX.EXE",                            # Microsoft Office Home 소프트웨어 일부
                            "MOUSOCOREWORKER.EXE",                  # 새로운 Windows 업데이트가 있는지 확인
                            "MSCORSVW.EXE",                         # Windows pre-compiling 서비스
                            "NGEN.EXE",                             # 네이티브 이미지 생성기
                            "NGENTASK.EXE",                         # 네이티브 이미지 생성기 작업
                            "RUNTIMEBROKER.EXE",                    # Windows 스토어/모던 앱 관리
                            "SVCHOST.EXE",                          # Win32 서비스 처리 호스트 프로세스
                            "TASKHOSTW.EXE",                        # Windows 작업용 호스트 프로세스
                            "TASKMGR.EXE",                          # Windows 작업 관리자 실행
                            "TIWORKER.EXE",                         # 하드웨어 및 소프트웨어 최적화, 드라이버 업데이트
                            "WERFAULT.EXE",                         # Microsoft 시스템 에러 리포팅 서비스
                            "WMIPRVSE.EXE",                         # WMI 용 Microsoft 공급자 호스트 서비스
                            "SPPSVC.EXE",                           # Microsoft 소프트웨어 플랫폼 보호 서비스
                            "MPCMDRUN.EXE",                         # Microsoft 멀웨어 방지 명령 줄 유틸리티
                            "SCHTASKS.EXE",                         # 작업 스케줄러
                            "SIHCLIENT.EXE",                        # 자동 Windows 업데이트 클라이언트
                            "WUDFHOST.EXE",                         # Windows 하드웨어 장치 용 통신 에이전트
                            "RUNDLL32.EXE",                         # DLL 파일을 다른 응용 프로그램에서 실행
                            "SHELLEXPERIENCEHOST.EXE",              # 범용 응용 프로그램을 Windows 쉘과 통합
                            "SEARCHAPP.EXE",                        # Cortana 내부에서 실행하는 검색 도구
                            "TEXTINPUTHOST.EXE",                    # Windows 10 받아쓰기 기능
                            "SIHOST.EXE",                           # 쉘 인프라 호스트
                            "STARTMENUEXPERIENCEHOST.EXE",          # 시작메뉴 호스트
                            "VIDEO.UI.EXE",                         # XBox Live 엔터테인먼트 플랫폼 소프트웨어 구성 요소
                            "PICKERHOST.EXE",                       # 파일 선택 UI 호스트
                            "OPENWITH.EXE",                         # 응용 프로그램 선택 프로세스
                            "MSIEXEC.EXE",                          # Windows 인스톨러
                            "MMC.EXE",                              # Microsoft 관리 콘솔 구성 요소
                            "SPLWOW64.EXE",                         # 프린터 드라이버 호스트
                            "SEARCHPROTOCOLHOST.EXE",               # Windows 인덱싱 검색 서비스 일부
                            "SEARCHFILTERHOST.EXE",                 # Windows 인덱싱 프로그램 일부
                            "NISSRV.EXE",                           # 네트워크 실시간 검사 서비스
                            "OFFICESVCMGR.EXE",                     # Microsoft Office Serviceability Manager
                            "QUICKSEARCH.EXE",                      # Glarysoft QuickSearch 프로세스
                            "SDXHELPER.EXE",                        # Microsoft Office SDX 도우미
                            "SYSTEMSETTINGS.EXE",                   # PC 설정
                            "TRUSTEDINSTALLER.EXE",                 # Windows 모듈 설치 관리자
                            "UPFC.EXE",                             # Updateability From SCM
                            "USOCLIENT.EXE",                        # Windows 업데이트 (검색, 설치, 다시 시작)
                            "WUAPIHOST.EXE",                        # Wuapi.dll 호스팅 파일 (Windows Update Client API)
                            "WUAUCLT.EXE",                          # Windows 운영체제 용 소프트웨어 업데이트 유틸리티
                            "LOCKAPP.EXE",                          # 로그인 전에 나타나는 잠금화면 오버레이
                            "BACKGROUNDTRANSFERHOST.EXE",           # Windows 앱에서 백그라운드 또는 데이터를 다운로드/업로드
                            "COMPATTELRUNNER.EXE",                  # Windows7에서 Windows10으로 넘어가는 설치의 호환성 검사 및 보고
                            "CVTRES.EXE",                           # Microsoft 리소스 파일 COFF 개체 변환 유틸리티
                            "ICACLS.EXE",                           # Windows Server 2003 용 명령 줄 유틸리티
                            "LAUNCHTM.EXE",                         # Windows 고급 작업 관리자
                            "MPSIGSTUB.EXE",                        # Windows 자동 업데이트와 함께 사용되는 설치 응용 프로그램
                            "OFFICECLICKTORUN.EXE",                 # Office 제품 관련 업데이트 관리
                            "SECURITYHEALTHHOST.EXE",               # Windows 보안 상태 서비스
                            "VSSVC.EXE",                            # 볼륨의 스냅 샷을 백업할 수 있는 백업 유틸리티
                            "BYTECODEGENERATOR.EXE",                # AppX Deployment Bytecode Generator EXE
                            "DEFRAG.EXE",                           # Windows 디스크 조각 모음
                            "DISMHOST.EXE",                         # Windows 이미지 서비스 및 준비를 위한 명령 줄 도구
                            "DRVINST.EXE",                          # 하드웨어 장치와 OS 또는 응용 프로그램 간에 통신 생성
                            "DSMUSERTASK.EXE",                      # Device Setup Manager User Task Handler
                            "FILESYNCCONFIG.EXE",                   # Cisco VPN Client Fix
                            "FODHELPER.EXE",                        # Bridges Microsoft Office network connections
                            "FSQUIRT.EXE",                          # Bluetooth 파일 전송 마법사 GUI 실행
                            "LOCALBRIDGE.EXE",                      # 잘못된 이미지, 바이너리 코드 손상 오류
                            "MOBSYNC.EXE",                          # Microsoft Sync Center
                            "MRT.EXE",                              # Windows 자체적으로 악성코드를 제거
                            "MSDTC.EXE",                            # Microsoft Distributed Transaction Corrdinator Service
                            "SEARCHINDEXER.EXE",                    # 파일을 미리 검색하고 색인하는 Windows 서비스
                            "SECURITYHEALTHSERVICE.EXE",            # Windows 보안 상태 서비스
                            "SETTINGSYNCHOST.EXE",                  # 동기화 호스트 설정 프로그램
                            "SPPEXTCOMOBJ.EXE",                     # Windows 코어 시스템 파일
                            "VERCLSID.EXE",                         # Windows 탐색기로 표시되기 전에 COM 개체 확인
                            "WERMGR.EXE",                           # Microft 서명 파일
                            "WIMSERV.EXE",                          # Windows의 디스크 이미징 유틸리티
                            "WLRMDR.EXE",                           # Windows 로그온 알림
                            "WMIADAP.EXE",                          # WMI 레파지토리에서 성능정보 업데이트
                            "WOWREG32.EXE",                         # SetupAPI 32-bit Surrogate 
                            "WWAHOST.EXE",                          # Windows 스토어 앱을 호스트하고 실행
                            "WLANEXT.EXE",                          # Windows 프레임 워크 실행
                            "SYSTEMSETTINGSADMINFLOWS.EXE",         # 파일 열기, 수정, 삭제에 필요한 관리자 권한 담당
                            "SYSTEMPROPERTIESADVANCED.EXE",         # Microsoft 시스템 고급설정 변경 응용 프로그램
                            "SPATIALAUDIOLICENSESRV.EXE",           # 오디오 시스템의 일부
                            "SNDVOL.EXE",                           # 시스템의 볼륨 설정 제어
                            "SMARTSCREEN.EXE",                      # Windows 10 다운로드 된 멀웨어, 악성 웹 사이트로부터 보호
                            "SECHEALTHUI.EXE",                      # Windows Defender 응용 프로그램
                            "SDIAGNHOST.EXE",                       # Scripted Diagostics Native Host를 여는 파일
                            "ONEDRIVE.EXE",                         # One Drive
                            "MAKECAB.EXE",                          # Windows 용 파일 보관 유틸리티
                            "LOGONUI.EXE",                          # 로그온 사용자 인터페이스 관련 파일
                            "EXPLORER.EXE",                         # 파일 탐색기
                            "COMPPKGSRV.EXE",                       # Component Package Support Server
                            "APPVLP.EXE",                           # Microsoft Application Virtualization
                            "AM_DELTA_PATCH",                       # Microsoft 바이러스 백신
                            "MSOASB.EXE",                           # Microsoft Office 2016 Preview
                            "SUENGINE.EXE",                         # 삼성 제품군 시스템 업데이트 관련 프로그램
                            "SAMSUNGSETTINGS.EXE",                  # 삼성 업데이트
                            "MCUIHOST.EXE",                         # McAfee UI Host
                            "MCHOST.EXE",                           # McAfee Total Protection
                            "MCAUTOREG.EXE",                        # McAfee Total Protection
                            "MCUICNT.EXE",                          # McAfee Security Scan Plus
                            "GUP.EXE",                              # Secure KeyStroke for POS, 단말기 보안솔루션
                            "UPDATER.EXE",                          # Internet Explorer Ask Toolbar
                            "GOOGLEUPDATE.EXE",                     # Google 응용 프로그램 업데이트 패키지
                            "MICROSOFTEDGEUPDATE.EXE",              # Microsoft Edge 설치 및 업데이트
                            "CHXSMARTSCREEN.EXE",                   # 특정 파일이 바이러스인지 확인
                            "UN_A.EXE",                             # 안티 멀웨어 Byte Technologies LLC
                            "NPUPDATEC.EXE",                        # nProtect Online Security 키보드 보안
                            "KOSINJ.EXE",                           # 킹스정보통신(주) K-Defense
                            "KOS_UPDATE.EXE",                       # 킹스정보통신 키보드 보안
                            "UNIFIEDINSTALLER.EXE"                  # Update for Windows Update Service
                        ]

        for r in range(len(activitiesCache_list)):
            flag = 0

            # artifact_timestamp (Epoch Time)
            artifact_timestamp, artifact_item_path, artifact_appName = activitiesCache_list[r].split(' - ')
            artifact_appName = artifact_appName.split('\\')[-1]
            print(artifact_appName)

            p = re.compile("\w{8}[-]\w{4}[-]\w{4}[-]\w{4}[-]\w{12}")
            if p.match(artifact_appName) or artifact_appName == "ECB32AF3-1440-4086-94E3-5311F97F89C4" or "default$windows.data" in artifact_appName:
                pass
            else:
                # UTC+9
                artifact_timestamp = datetime.datetime.strptime(artifact_timestamp, '%Y-%m-%d %H:%M:%S').timestamp()
                artifact_timestamp += 32400
                artifact_date_item = datetime.datetime.fromtimestamp(artifact_timestamp).strftime('%Y-%m-%d/%H:%M:%S')
                artifact_item = artifact_item_path.split('\\')[-1]

                for k in range(len(self.dateList)):
                    if artifact_timestamp >= self.dateList[k][0] and artifact_timestamp <= self.dateList[k][1]:
                        flag += 1

                if flag > 0 and artifact_item not in basic_program:
                    self.exe_cnt += 1
                    self.result.append("윈도우 타임라인" + "," + artifact_date_item + "," + artifact_appName + " (" + artifact_item + ")" + "," + "프로그램 실행" + "," + "icon_exec" + "," + label + "," + artifact_item_path)
                
        self.label_exe_step3.setText(str(self.exe_cnt) + " 건")
        self.completeCnt += 10
        print("Progressing...(" + str(self.completeCnt) + "%) ==> ActivitiesCache completed")


    def func_eventLog(self):
        label = "정보차단/사적지시/전가/SNS/초과근무/휴가/육아휴직"

        list = []

        for r in range(len(self.dateList)):

            start = datetime.datetime.fromtimestamp(self.dateList[r][0]).strftime('\"%m/%d/%Y %H:%M:%S\"')
            end = datetime.datetime.fromtimestamp(self.dateList[r][1]).strftime('\"%m/%d/%Y %H:%M:%S\"')

            list.append(psevt.evtParse(start, end))
            
        for r in range(len(list)):
            for k in range(len(list[r])):
                for s in range(len(list[r][k])):
                    try:
                        timestamp, date, dec, id = list[r][k][s].split(',')
                        self.evt_cnt += 1
                        self.result.append("이벤트 로그" + "," + date + "," + "컴퓨터 관리 기록" + "," + dec + "," + "icon_system_" + id + "," + label)
                    except:
                        pass

        self.label_evt_step3.setText(str(self.evt_cnt) + " 건")
        self.completeCnt += 10
        print("Progressing...(" + str(self.completeCnt) + "%) ==> Eventlog completed")



    def func_usb(self):
        label = "사적지시/전가/초과근무"

        list = []

        for r in range(len(self.dateList)):

            start = datetime.datetime.fromtimestamp(self.dateList[r][0]).strftime('\"%m/%d/%Y %H:%M:%S\"')
            end = datetime.datetime.fromtimestamp(self.dateList[r][1]).strftime('\"%m/%d/%Y %H:%M:%S\"')

            list.append(psusb.usbParse(start, end))
                
        for r in range(len(list)):
            for k in range(len(list[r])):
                date, device = list[r][k].split(',')
                self.usb_cnt += 1
                self.result.append("이벤트 로그" + "," + date + "," + "외부장치 연결" + "," + device + "," + "icon_system_507" + "," + label)


        self.label_usb_step3.setText(str(self.usb_cnt) + " 건")
        self.completeCnt += 10
        print("Progressing...(" + str(self.completeCnt) + "%) ==> USB Device completed")


    def startExtractClick(self):

        self.doc_cnt = 0
        self.exe_cnt = 0
        self.web_cnt = 0
        self.usb_cnt = 0
        self.evt_cnt = 0
        self.recycle_cnt = 0

        self.completeCnt = 0

        self.result = []
        self.dateList = []

        row = self.dateList_step1.count()

        for r in range(row):
            self.dateList.append([])
            item = self.dateList_step1.item(r).text()
            tmp = item.split(' ~ ')
            startTime = datetime.datetime.strptime(tmp[0], '%Y-%m-%d %p %I:%M').timestamp()
            endTime = datetime.datetime.strptime(tmp[1], '%Y-%m-%d %p %I:%M').timestamp()
            self.dateList[r].append(startTime)
            self.dateList[r].append(endTime)


        #self.func_prefetch()
        #self.func_jumplist()
        #self.func_recycleBin()
        #self.func_history()
        self.func_activitiesCache()
        #self.func_eventLog()
        #self.func_usb()

        self.nextBtnClick()

        self.label_doc_step3.setText(str(self.doc_cnt) + " 건")
        self.label_exe_step3.setText(str(self.exe_cnt) + " 건")
        self.label_web_step3.setText(str(self.web_cnt) + " 건")
        self.label_usb_step3.setText(str(self.usb_cnt) + " 건")
        self.label_evt_step3.setText(str(self.evt_cnt) + " 건")
        self.label_recycle_step3.setText(str(self.recycle_cnt) + " 건")


    def addDateBtnClick(self):
        start_time = self.startDate_step1.dateTime()
        end_time = self.endDate_step1.dateTime()

        start_time_epoch = start_time.toTime_t()
        end_time_epoch = end_time.toTime_t()

        if start_time_epoch > end_time_epoch:
            self.warning_step1_1 = warningDialog_step1_1()
        else:
            string = datetime.datetime.fromtimestamp(start_time_epoch).strftime('%Y-%m-%d/%H:%M:%S') + "~" + datetime.datetime.fromtimestamp(end_time_epoch).strftime('%Y-%m-%d/%H:%M:%S')
            day_item = datetime.datetime.fromtimestamp(start_time_epoch).strftime('%Y-%m-%d %p %I:%M') + " ~ " + datetime.datetime.fromtimestamp(end_time_epoch).strftime('%Y-%m-%d %p %I:%M')

            if self.is_existItem(day_item):
                self.userDate.append(string)
                self.dateList_step1.addItem(day_item)


    def is_existItem(self, date):
        raw = self.dateList_step1.count()

        if raw > 0:
            for r in range(raw):
                if date == self.dateList_step1.item(r).text():
                    self.warning_step1_4 = warningDialog_step1_4()
                    return False

        return True


    def delDateBtnClick(self):
        if self.dateList_step1.count() > 0:
            row = self.dateList_step1.currentRow()
            if row > -1:
                # 2021-11-16 PM 02:14 ~ 2021-11-16 PM 02:16
                string = self.dateList_step1.item(row).text()
                start, end = string.split(' ~ ')
                start = datetime.datetime.strptime(start, '%Y-%m-%d %p %I:%M').timestamp()
                end = datetime.datetime.strptime(end, '%Y-%m-%d %p %I:%M').timestamp()

                # 2021-11-16/14:14:11~2021-11-16/14:16:22
                date_str = datetime.datetime.fromtimestamp(start).strftime('%Y-%m-%d/%H:%M:%S') + "~" + datetime.datetime.fromtimestamp(end).strftime('%Y-%m-%d/%H:%M:%S')

                for r in range(len(self.userDate)):
                    if self.userDate[r] == date_str:
                        self.userDate.remove(date_str)

                self.dateList_step1.takeItem(row)
            else:
                self.warning_step1_3 = warningDialog_step1_3()
        else:
            self.warning_step1_2 = warningDialog_step1_2()


    def selectComboItem(self, item):
        now_time = datetime.datetime.today().timestamp()

        comboList = ["3시간", "1일", "3일", "1주", "2주", "1개월"]

        if item.currentText() in comboList:
            if item.currentText() == "3시간":
                tmp_time = now_time - 10800

            elif item.currentText() == "1일":
                tmp_time = now_time - 86400
            
            elif item.currentText() == "3일":
                tmp_time = now_time - 259200
            
            elif item.currentText() == "1주":
                tmp_time = now_time - 604800
            
            elif item.currentText() == "2주":
                tmp_time = now_time - 1209600
            
            elif item.currentText() == "1개월":
                tmp_time = now_time - 2592000

            day_item = datetime.datetime.fromtimestamp(tmp_time).strftime('%Y-%m-%d %p %I:%M') + " ~ " + datetime.datetime.today().strftime('%Y-%m-%d %p %I:%M')
            string = datetime.datetime.fromtimestamp(tmp_time).strftime('%Y-%m-%d/%H:%M:%S') + "~" + datetime.datetime.today().strftime('%Y-%m-%d/%H:%M:%S')

            if self.is_existItem(day_item):
                self.dateList_step1.addItem(day_item)
                self.userDate.append(string)

        else:
            print("error")

    def mousePressEvent(self, event):
        if event.button() == QtCore.Qt.LeftButton:
            self.m_flag = True
            self.m_Position = event.globalPos() - self.pos()
            event.accept()
            self.setCursor(QtGui.QCursor(QtCore.Qt.OpenHandCursor))

    def mouseMoveEvent(self, QMouseEvent):
        if QtCore.Qt.LeftButton and self.m_flag:
            self.move(QMouseEvent.globalPos() - self.m_Position)
            QMouseEvent.accept()

    def mouseReleaseEvent(self, QMouseEvent):
        self.m_flag = False
        self.setCursor(QtGui.QCursor(QtCore.Qt.ArrowCursor))

    def helpBtn_step1Click(self):
        self.help = helpDialog()
        self.help.stackedWidget_help.setCurrentIndex(1)
    
    def helpBtn_step2Click(self):
        self.help = helpDialog()
        self.help.stackedWidget_help.setCurrentIndex(2)

    def helpBtn_step3Click(self):
        self.help = helpDialog()
        self.help.stackedWidget_help.setCurrentIndex(3)
        
    def infoBtnClick(self):
        self.info = infoDialog()

    def downAnalysisBtnClick(self):
        try:
            if len(self.result) > 0:

                Filename_tmp = "컴퓨터 사용기록 추출결과"

                Filesave = QFileDialog.getSaveFileName(self, '파일 저장', Filename_tmp + "-" + str(datetime.datetime.now().date()), "csv files (*.csv)")
                FileHeader = ["타입, 시간, 작업명, 설명, 아이콘, 라벨링, 경로"]

                if Filesave[0] != "":
                    with open(Filesave[0], "w") as f:
                        
                        encoding_date = str(self.userDate).encode()
                        hexdigest_date = hashlib.sha256(encoding_date).hexdigest()
                        f.writelines(hexdigest_date)
                        f.write('\n')

                        encoding_result = str(self.result).encode()
                        hexdigest_result = hashlib.sha256(encoding_result).hexdigest()

                        f.writelines(hexdigest_result)
                        f.write('\n')

                        for r in range(len(self.userDate)):
                            f.writelines(self.userDate[r])
                            f.write(',')
                        f.write('\n')

                        f.writelines(FileHeader)
                        f.write('\n')

                        for r in range(len(self.result)):
                            f.writelines(self.result[r])
                            f.write('\n')
                        f.write('\n')


                    self.info = infoDialog_step3_1()
                else:
                    self.info = infoDialog_step3_2()
            
            else:
                self.warning_step3 = warningDialog_step3()
        
        except Exception as ex:
            print(ex)
            self.warning_step3 = warningDialog_step3()


class warningDialog_step1_1(QDialog, form_warningDialog_step1_1):
    def __init__(self):
        super(warningDialog_step1_1, self).__init__()
        self.initUI()
        self.show()
    
    def initUI(self):
        self.setupUi(self)
        self.setWindowFlag(QtCore.Qt.FramelessWindowHint)
        self.setAttribute(QtCore.Qt.WA_TranslucentBackground)
        
        self.okBtn_warning_step1.clicked.connect(self.okBtnClick)
    
    def okBtnClick(self):
        self.close()

    def mousePressEvent(self, event):
        if event.button() == QtCore.Qt.LeftButton:
            self.m_flag = True
            self.m_Position = event.globalPos() - self.pos()
            event.accept()
            self.setCursor(QtGui.QCursor(QtCore.Qt.OpenHandCursor))

    def mouseMoveEvent(self, QMouseEvent):
        if QtCore.Qt.LeftButton and self.m_flag:
            self.move(QMouseEvent.globalPos() - self.m_Position)
            QMouseEvent.accept()

    def mouseReleaseEvent(self, QMouseEvent):
        self.m_flag = False
        self.setCursor(QtGui.QCursor(QtCore.Qt.ArrowCursor))


class warningDialog_step1_2(QDialog, form_warningDialog_step1_2):
    def __init__(self):
        super(warningDialog_step1_2, self).__init__()
        self.initUI()
        self.show()
    
    def initUI(self):
        self.setupUi(self)
        self.setWindowFlag(QtCore.Qt.FramelessWindowHint)
        self.setAttribute(QtCore.Qt.WA_TranslucentBackground)
        
        self.okBtn_warning_step1.clicked.connect(self.okBtnClick)
    
    def okBtnClick(self):
        self.close()

    def mousePressEvent(self, event):
        if event.button() == QtCore.Qt.LeftButton:
            self.m_flag = True
            self.m_Position = event.globalPos() - self.pos()
            event.accept()
            self.setCursor(QtGui.QCursor(QtCore.Qt.OpenHandCursor))

    def mouseMoveEvent(self, QMouseEvent):
        if QtCore.Qt.LeftButton and self.m_flag:
            self.move(QMouseEvent.globalPos() - self.m_Position)
            QMouseEvent.accept()

    def mouseReleaseEvent(self, QMouseEvent):
        self.m_flag = False
        self.setCursor(QtGui.QCursor(QtCore.Qt.ArrowCursor))


class warningDialog_step1_3(QDialog, form_warningDialog_step1_3):
    def __init__(self):
        super(warningDialog_step1_3, self).__init__()
        self.initUI()
        self.show()
    
    def initUI(self):
        self.setupUi(self)
        self.setWindowFlag(QtCore.Qt.FramelessWindowHint)
        self.setAttribute(QtCore.Qt.WA_TranslucentBackground)
        
        self.okBtn_warning_step1.clicked.connect(self.okBtnClick)
    
    def okBtnClick(self):
        self.close()

    def mousePressEvent(self, event):
        if event.button() == QtCore.Qt.LeftButton:
            self.m_flag = True
            self.m_Position = event.globalPos() - self.pos()
            event.accept()
            self.setCursor(QtGui.QCursor(QtCore.Qt.OpenHandCursor))

    def mouseMoveEvent(self, QMouseEvent):
        if QtCore.Qt.LeftButton and self.m_flag:
            self.move(QMouseEvent.globalPos() - self.m_Position)
            QMouseEvent.accept()

    def mouseReleaseEvent(self, QMouseEvent):
        self.m_flag = False
        self.setCursor(QtGui.QCursor(QtCore.Qt.ArrowCursor))


class warningDialog_step1_4(QDialog, form_warningDialog_step1_4):
    def __init__(self):
        super(warningDialog_step1_4, self).__init__()
        self.initUI()
        self.show()
    
    def initUI(self):
        self.setupUi(self)
        self.setWindowFlag(QtCore.Qt.FramelessWindowHint)
        self.setAttribute(QtCore.Qt.WA_TranslucentBackground)
        
        self.okBtn_warning_step1.clicked.connect(self.okBtnClick)
    
    def okBtnClick(self):
        self.close()

    def mousePressEvent(self, event):
        if event.button() == QtCore.Qt.LeftButton:
            self.m_flag = True
            self.m_Position = event.globalPos() - self.pos()
            event.accept()
            self.setCursor(QtGui.QCursor(QtCore.Qt.OpenHandCursor))

    def mouseMoveEvent(self, QMouseEvent):
        if QtCore.Qt.LeftButton and self.m_flag:
            self.move(QMouseEvent.globalPos() - self.m_Position)
            QMouseEvent.accept()

    def mouseReleaseEvent(self, QMouseEvent):
        self.m_flag = False
        self.setCursor(QtGui.QCursor(QtCore.Qt.ArrowCursor))


class warningDialog_step3(QDialog, form_warningDialog_step3):
    def __init__(self):
        super(warningDialog_step3, self).__init__()
        self.initUI()
        self.show()
    
    def initUI(self):
        self.setupUi(self)
        self.setWindowFlag(QtCore.Qt.FramelessWindowHint)
        self.setAttribute(QtCore.Qt.WA_TranslucentBackground)
        
        self.okBtn_warning_step1.clicked.connect(self.okBtnClick)
    
    def okBtnClick(self):
        self.close()

    def mousePressEvent(self, event):
        if event.button() == QtCore.Qt.LeftButton:
            self.m_flag = True
            self.m_Position = event.globalPos() - self.pos()
            event.accept()
            self.setCursor(QtGui.QCursor(QtCore.Qt.OpenHandCursor))

    def mouseMoveEvent(self, QMouseEvent):
        if QtCore.Qt.LeftButton and self.m_flag:
            self.move(QMouseEvent.globalPos() - self.m_Position)
            QMouseEvent.accept()

    def mouseReleaseEvent(self, QMouseEvent):
        self.m_flag = False
        self.setCursor(QtGui.QCursor(QtCore.Qt.ArrowCursor))


class infoDialog(QDialog, form_infoDialog):
    def __init__(self):
        super(infoDialog, self).__init__()
        self.initUI()
        self.show()
    
    def initUI(self):
        self.setupUi(self)
        self.setWindowFlag(QtCore.Qt.FramelessWindowHint)
        self.setAttribute(QtCore.Qt.WA_TranslucentBackground)
        
        self.okBtn_warning_step1.clicked.connect(self.okBtnClick)
    
    def okBtnClick(self):
        self.close()

    def mousePressEvent(self, event):
        if event.button() == QtCore.Qt.LeftButton:
            self.m_flag = True
            self.m_Position = event.globalPos() - self.pos()
            event.accept()
            self.setCursor(QtGui.QCursor(QtCore.Qt.OpenHandCursor))

    def mouseMoveEvent(self, QMouseEvent):
        if QtCore.Qt.LeftButton and self.m_flag:
            self.move(QMouseEvent.globalPos() - self.m_Position)
            QMouseEvent.accept()

    def mouseReleaseEvent(self, QMouseEvent):
        self.m_flag = False
        self.setCursor(QtGui.QCursor(QtCore.Qt.ArrowCursor))


class infoDialog_step3_1(QDialog, form_infoDialog_step3_1):
    def __init__(self):
        super(infoDialog_step3_1, self).__init__()
        self.initUI()
        self.show()
    
    def initUI(self):
        self.setupUi(self)
        self.setWindowFlag(QtCore.Qt.FramelessWindowHint)
        self.setAttribute(QtCore.Qt.WA_TranslucentBackground)
        
        self.okBtn_warning_step1.clicked.connect(self.okBtnClick)
    
    def okBtnClick(self):
        self.close()

    def mousePressEvent(self, event):
        if event.button() == QtCore.Qt.LeftButton:
            self.m_flag = True
            self.m_Position = event.globalPos() - self.pos()
            event.accept()
            self.setCursor(QtGui.QCursor(QtCore.Qt.OpenHandCursor))

    def mouseMoveEvent(self, QMouseEvent):
        if QtCore.Qt.LeftButton and self.m_flag:
            self.move(QMouseEvent.globalPos() - self.m_Position)
            QMouseEvent.accept()

    def mouseReleaseEvent(self, QMouseEvent):
        self.m_flag = False
        self.setCursor(QtGui.QCursor(QtCore.Qt.ArrowCursor))


class infoDialog_step3_2(QDialog, form_infoDialog_step3_2):
    def __init__(self):
        super(infoDialog_step3_2, self).__init__()
        self.initUI()
        self.show()
    
    def initUI(self):
        self.setupUi(self)
        self.setWindowFlag(QtCore.Qt.FramelessWindowHint)
        self.setAttribute(QtCore.Qt.WA_TranslucentBackground)
        
        self.okBtn_warning_step1.clicked.connect(self.okBtnClick)
    
    def okBtnClick(self):
        self.close()

    def mousePressEvent(self, event):
        if event.button() == QtCore.Qt.LeftButton:
            self.m_flag = True
            self.m_Position = event.globalPos() - self.pos()
            event.accept()
            self.setCursor(QtGui.QCursor(QtCore.Qt.OpenHandCursor))

    def mouseMoveEvent(self, QMouseEvent):
        if QtCore.Qt.LeftButton and self.m_flag:
            self.move(QMouseEvent.globalPos() - self.m_Position)
            QMouseEvent.accept()

    def mouseReleaseEvent(self, QMouseEvent):
        self.m_flag = False
        self.setCursor(QtGui.QCursor(QtCore.Qt.ArrowCursor))


class loading(QWidget, form_loadingWidget):
    def __init__(self, parent):
        super(loading, self).__init__(parent)
        self.parent = parent
        self.initUI()
        self.center()
        self.show()

    def initUI(self):
        self.setupUi(self)
        self.setWindowFlag(QtCore.Qt.FramelessWindowHint)
        self.setAttribute(QtCore.Qt.WA_TranslucentBackground)
        self.stopBtn_progress.clicked.connect(self.stopBtnClick)

        self.m_flag = False

        self.movie = QMovie(resource_path("icons\spinner.gif"), QByteArray(), self)
        self.movie.setCacheMode(QMovie.CacheAll)
        self.loadingLabel.setMovie(self.movie)
        self.movie.start()

        self.timer = QTimer()
        self.timer.timeout.connect(self.handleTimer)
        self.timer.start(200)
    
    def handleTimer(self):
        value = self.progressBar.value()
        if value < 100:
            value += 1
            self.progressBar.setValue(value)
        else:
            self.timer.stop()
            self.close()

    def stopBtnClick(self):
        #self.parent.stopThread()
        self.close()

    def center(self):
        qr = self.frameGeometry()
        cp = QDesktopWidget().availableGeometry().center()
        qr.moveCenter(cp)
        self.move(qr.topLeft())

    def mousePressEvent(self, event):
        if event.button() == QtCore.Qt.LeftButton:
            self.m_flag = True
            self.m_Position = event.globalPos() - self.pos()
            event.accept()
            self.setCursor(QtGui.QCursor(QtCore.Qt.OpenHandCursor))

    def mouseMoveEvent(self, QMouseEvent):
        if QtCore.Qt.LeftButton and self.m_flag:
            self.move(QMouseEvent.globalPos() - self.m_Position)
            QMouseEvent.accept()

    def mouseReleaseEvent(self, QMouseEvent):
        self.m_flag = False
        self.setCursor(QtGui.QCursor(QtCore.Qt.ArrowCursor))



class helpDialog(QDialog, form_helpDialog):
    def __init__(self):
        super(helpDialog, self).__init__()
        self.initUI()
        self.show()
    
    def initUI(self):
        self.setupUi(self)
        self.setWindowFlag(QtCore.Qt.FramelessWindowHint)
        self.setAttribute(QtCore.Qt.WA_TranslucentBackground)

        self.m_flag = False

        self.closeBtn_main.clicked.connect(self.closeBtnClick)
        self.closeBtn_step1.clicked.connect(self.closeBtnClick)
        self.closeBtn_step2.clicked.connect(self.closeBtnClick)
        self.closeBtn_step3.clicked.connect(self.closeBtnClick)
        self.closeBtn_step4.clicked.connect(self.closeBtnClick)

        self.displayBtn_main.clicked.connect(lambda: webbrowser.open('ms-settings:display?activationSource=SMC-IA-4027860'))

    def closeBtnClick(self):
        self.close()

    def mousePressEvent(self, event):
        if event.button() == QtCore.Qt.LeftButton:
            self.m_flag = True
            self.m_Position = event.globalPos() - self.pos()
            event.accept()
            self.setCursor(QtGui.QCursor(QtCore.Qt.OpenHandCursor))

    def mouseMoveEvent(self, QMouseEvent):
        if QtCore.Qt.LeftButton and self.m_flag:
            self.move(QMouseEvent.globalPos() - self.m_Position)
            QMouseEvent.accept()

    def mouseReleaseEvent(self, QMouseEvent):
        self.m_flag = False
        self.setCursor(QtGui.QCursor(QtCore.Qt.ArrowCursor))

        
if __name__ == "__main__":
    app = QApplication(sys.argv)
    fontDB = QFontDatabase()
    fontDB.addApplicationFont(resource_path('fonts\나눔스퀘어.ttf'))
    fontDB.addApplicationFont(resource_path('fonts\나눔스퀘어 Bold.ttf'))
    app.setFont(QFont(resource_path('fonts\나눔스퀘어.ttf')))
    app.setFont(QFont(resource_path('fonts\나눔스퀘어 Bold.ttf')))
    main_window = MainWindow()
    main_window.show()
    app.exec_()
