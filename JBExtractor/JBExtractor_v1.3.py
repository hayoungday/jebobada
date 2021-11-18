import os
import sys
import time
import datetime
import webbrowser
import hashlib

import traceback

from PyQt5 import uic
from PyQt5 import QtCore
from PyQt5.QtCore import QPoint, QThread, QTimer, QDateTime
from PyQt5.QtWidgets import *
from PyQt5.QtGui import *

from windowsprefetch import Prefetch
from JLParser import JL
from recycleParser import Recycle
from browser_history import get_history

import evtx_dump
from stickyParser import snt, plum

# Get absolute path to resource, works for dev and for PyInstaller
def resource_path(relative_path):
    base_path = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_path, relative_path)

# UI Setting
form = resource_path('JBExtractor_v1.1.ui')
form_mainWindow = uic.loadUiType(form)[0]
form_loading = resource_path('jb_loading.ui')
form_loadingDialog = uic.loadUiType(form_loading)[0]
form_help_step1 = resource_path('jb_help_step1.ui')
form_helpDialog_step1 = uic.loadUiType(form_help_step1)[0]
form_help_step2 = resource_path('jb_help_step2.ui')
form_helpDialog_step2 = uic.loadUiType(form_help_step2)[0]
form_warning_step1_1  = resource_path('jb_warning_step1_1.ui')
form_warningDialog_step1_1  = uic.loadUiType(form_warning_step1_1)[0]
form_warning_step1_2  = resource_path('jb_warning_step1_2.ui')
form_warningDialog_step1_2  = uic.loadUiType(form_warning_step1_2)[0]
form_warning_step1_3  = resource_path('jb_warning_step1_3.ui')
form_warningDialog_step1_3  = uic.loadUiType(form_warning_step1_3)[0]
form_warning_step1_4  = resource_path('jb_warning_step1_4.ui')
form_warningDialog_step1_4  = uic.loadUiType(form_warning_step1_4)[0]
form_warning_step3  = resource_path('jb_warning_step3.ui')
form_warningDialog_step3  = uic.loadUiType(form_warning_step3)[0]

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

    #------------------------------------------------------------------------------#
        # Signal of main screen
        self.nextBtn_main.clicked.connect(self.nextBtnClick)
        self.exitBtn_main.clicked.connect(self.exitBtnClick)
        self.minBtn_main.clicked.connect(self.showMinimized)
        self.homeBtn_main.clicked.connect(self.homeBtnClick)
        self.downMenuBtn_main.clicked.connect(self.downMenuClick)
        self.internetBtn_main.clicked.connect(lambda: webbrowser.open('http://gabjil119.co.kr/'))

    #------------------------------------------------------------------------------#
        # Signal of step1 screen
        self.nextBtn_step1.clicked.connect(self.nextBtnClick_step1)
        self.backBtn_step1.clicked.connect(self.backBtnClick)
        self.exitBtn_step1.clicked.connect(self.exitBtnClick)
        self.minBtn_step1.clicked.connect(self.showMinimized)
        self.helpBtn_step1.clicked.connect(self.helpBtn_step1Click)
        self.homeBtn_step1.clicked.connect(self.homeBtnClick)
        self.downMenuBtn_step1.clicked.connect(self.downMenuClick)
        self.internetBtn_step1.clicked.connect(lambda: webbrowser.open('http://gabjil119.co.kr/'))

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
        self.exitBtn_step2.clicked.connect(self.exitBtnClick)
        self.minBtn_step2.clicked.connect(self.showMinimized)
        self.helpBtn_step2.clicked.connect(self.helpBtn_step2Click)
        self.homeBtn_step2.clicked.connect(self.homeBtnClick)
        self.downMenuBtn_step2.clicked.connect(self.downMenuClick)
        self.internetBtn_step2.clicked.connect(lambda: webbrowser.open('http://gabjil119.co.kr/'))

        self.extractBtn_step2.clicked.connect(self.startExtractClick)

        self.result = []

        self.prefetchThread = prefetchParse(self)
        self.jumplistThread = jumplistParse(self)
        self.recyclebinThread = recyclebinParse(self)
        self.historyThread = historyParse(self)
        self.stickyThread = stickyParse(self)
        self.eventlogThread = eventlogParse(self)

    #------------------------------------------------------------------------------#
        # Sigal of step3 screen
        self.nextBtn_step3.clicked.connect(self.nextBtnClick)
        self.backBtn_step3.clicked.connect(self.backBtnClick)
        self.exitBtn_step3.clicked.connect(self.exitBtnClick)
        self.minBtn_step3.clicked.connect(self.showMinimized)
        self.homeBtn_step3.clicked.connect(self.homeBtnClick)
        self.downMenuBtn_step3.clicked.connect(self.downMenuClick)
        self.internetBtn_step3.clicked.connect(lambda: webbrowser.open('http://gabjil119.co.kr/'))

        self.downAnalysisBtn_step3.clicked.connect(self.downAnalysisBtnClick)

        self.doc_cnt = 0
        self.exe_cnt = 0
        self.web_cnt = 0
        self.usb_cnt = 0
        self.evt_cnt = 0
        self.recycle_cnt = 0

    #------------------------------------------------------------------------------#
        # Signal of step4 screen
        self.nextBtn_step4.clicked.connect(self.nextBtnClick)
        self.backBtn_step4.clicked.connect(self.backBtnClick)
        self.exitBtn_step4.clicked.connect(self.exitBtnClick)
        self.minBtn_step4.clicked.connect(self.showMinimized)
        self.homeBtn_step4.clicked.connect(self.homeBtnClick)
        self.downMenuBtn_step4.clicked.connect(self.downMenuClick)
        self.internetBtn_step4.clicked.connect(lambda: webbrowser.open('http://gabjil119.co.kr/'))

        self.uploadBtn_step4.clicked.connect(lambda: webbrowser.open('http://gabjil119.co.kr/'))
        
    #------------------------------------------------------------------------------#
        # Signal of step5 screen
        self.backBtn_step5.clicked.connect(self.backBtnClick)
        self.exitBtn_step5.clicked.connect(self.exitBtnClick)
        self.minBtn_step5.clicked.connect(self.showMinimized)
        self.homeBtn_step5.clicked.connect(self.homeBtnClick)
        self.downMenuBtn_step5.clicked.connect(self.downMenuClick)
        self.internetBtn_step5.clicked.connect(lambda: webbrowser.open('http://gabjil119.co.kr/'))
        
        self.startBtn_step5.clicked.connect(self.homeBtnClick)
        self.endBtn_step5.clicked.connect(self.exitBtnClick)


    def nextBtnClick(self):
        index = self.stackedWidget.currentIndex()
        self.stackedWidget.setCurrentIndex((index + 1))


    def nextBtnClick_step1(self):
        if self.dateList_step1.count() == 0:
            self.warning_step1_2 = warningDialog_step1_2()
        else:
            index = self.stackedWidget.currentIndex()
            self.stackedWidget.setCurrentIndex((index + 1))


    def backBtnClick(self):
        index = self.stackedWidget.currentIndex()
        self.stackedWidget.setCurrentIndex((index - 1))


    def exitBtnClick(self):
        self.close()


    def homeBtnClick(self):
        self.stackedWidget.setCurrentIndex(0)


    def downMenuClick(self):
        self.stackedWidget.setCurrentIndex(3)


    def reloadBtnClick(self):
        self.startDate_step1.setDateTime(QDateTime.currentDateTime())
        self.endDate_step1.setDateTime(QDateTime.currentDateTime())
        self.comboBox_step1.setCurrentIndex(0)

        for r in range(self.dateList_step1.count() - 1, -1, -1):
            self.dateList_step1.takeItem(r)

        self.userDate = []

    def startExtractClick(self):
        self.dateList = []
        row = self.dateList_step1.count()

        self.loading = loadingScreenDialog()

        for r in range(row):
            self.dateList.append([])
            item = self.dateList_step1.item(r).text()
            tmp = item.split(' ~ ')
            startTime = datetime.datetime.strptime(tmp[0], '%Y년 %m월 %d일 %p %I:%M').timestamp()
            endTime = datetime.datetime.strptime(tmp[1], '%Y년 %m월 %d일 %p %I:%M').timestamp()
            self.dateList[r].append(startTime)
            self.dateList[r].append(endTime)


        self.prefetchThread.start()
        self.jumplistThread.start()
        self.recyclebinThread.start()
        self.historyThread.start()
        self.stickyThread.start()
        self.eventlogThread.start()

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
            day_item = datetime.datetime.fromtimestamp(start_time_epoch).strftime('%Y년 %m월 %d일 %p %I:%M') + " ~ " + datetime.datetime.fromtimestamp(end_time_epoch).strftime('%Y년 %m월 %d일 %p %I:%M')

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
                start = datetime.datetime.strptime(start, '%Y년 %m월 %d일 %p %I:%M').timestamp()
                end = datetime.datetime.strptime(end, '%Y년 %m월 %d일 %p %I:%M').timestamp()

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

            day_item = datetime.datetime.fromtimestamp(tmp_time).strftime('%Y년 %m월 %d일 %p %I:%M') + " ~ " + datetime.datetime.today().strftime('%Y년 %m월 %d일 %p %I:%M')
            string = datetime.datetime.fromtimestamp(tmp_time).strftime('%Y-%m-%d/%H:%M:%S') + "~" + datetime.datetime.today().strftime('%Y-%m-%d/%H:%M:%S')

            if self.is_existItem(day_item):
                self.dateList_step1.addItem(day_item)
                self.userDate.append(string)

        else:
            print("error")

    def mousePressEvent(self, event):
        self.oldPos = event.globalPos()

    def mouseMoveEvent(self, event):
        delta = QPoint (event.globalPos() - self.oldPos)
        self.move(self.x() + delta.x(), self.y() + delta.y())
        self.oldPos = event.globalPos()

    def helpBtn_step1Click(self):
        self.help = helpDialog_step1()
    
    def helpBtn_step2Click(self):
        self.help = helpDialog_step2()

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

                    buttonReply = QMessageBox.information(self, "증거파일 저장", Filesave[0] + " 이 저장되었습니다.", QMessageBox.Ok)
                    #self.statusBar().showMessage(Filesave[0])
                else:
                    buttonReply = QMessageBox.information(self, "증거파일 저장", "파일이 저장되지 않았습니다.", QMessageBox.Ok)
        
        except:
            
            self.warning_step3 = warningDialog_step3()


class prefetchParse(QThread):
    def __init__(self, parent):
        super().__init__(parent)
        self.parent = parent

    def run(self):
        prefetch_path = "C:\\Windows\\Prefetch"

        # Not showing these programs in csv file
        basic_program = ["APPLICATIONFRAMEHOST.EXE", "AUDIODG.EXE", "BACKGROUNDTASKHOST.EXE", "CONHOST.EXE", "CONSENT.EXE",
                        "DLLHOST.EXE", "FILECOAUTH.EXE", "GAMEBAR.EXE", "HELPPANE.EXE", "INDEX.EXE", "INST.EXE", "MOUSOCOREWORKER.EXE",
                        "MSCORSVW.EXE", "NGEN.EXE", "NGENTASK.EXE", "RUNTIMEBROKER.EXE", "SVCHOST.EXE", "TASKHOSTW.EXE", "TASKMGR.EXE",
                        "TIWORKER.EXE", "UPDATER.EXE", "WERFAULT.EXE", "WMIPRVSE.EXE", "MCHOST.EXE", "MCAUTOREG.EXE", "SPPSVC.EXE",
                        "GOOGLEUPDATE.EXE", "MICROSOFTEDGEUPDATE.EXE", "MPCMDRUN.EXE", "SCHTASKS.EXE", "SIHCLIENT.EXE", "WSL.EXE", "WUDFHOST.EXE", "RUNDLL32.EXE"]

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
                time_obj = datetime.datetime.strptime(timestamp, '%Y-%m-%d %H:%M:%S.%f').timestamp()

                for r in range(len(self.parent.dateList)):
                    if time_obj >= self.parent.dateList[r][0] and time_obj <= self.parent.dateList[r][1]:
                        flag += 1
                    
                if flag > 0:
                    if p.executableName not in basic_program:
                        self.parent.exe_cnt += 1
                        self.parent.result.append("{},{},{},{},{},{}".format(
                            "프리패치",
                            timestamp.replace(' ', '/').split('.')[0],
                            p.executableName,
                            "프로그램 실행",
                            "icon_exec",
                            "사적지시/전가/SNS/초과근무/감시/휴가/육아휴직"
                        ))


        self.parent.label_exe_step3.setText(str(self.parent.exe_cnt) + " 건")
        print("Prefetch completed")


class jumplistParse(QThread):
    def __init__(self, parent):
        super().__init__(parent)
        self.parent = parent

    def run(self):
        #appid_path = os.path.dirname(os.path.abspath(__file__)) + '/JLParser_AppID.csv'

        jumplist_item = JL("C:\\Users\\{}\\AppData\\Roaming\\Microsoft\\Windows\\Recent".format(os.getlogin()))
        jumplist_list = jumplist_item.result.split('\n')

        ext_list = ['docx', 'xlsx', 'xls', 'pptx', 'pdf', 'txt', 'hwp', 'csv']
        label = "배제/사적지시/전가/업무제외/SNS/초과근무/건의/사직종용/제출강요/행사/장기자랑강요/후원강요/휴가/육아휴직/모임/실업급여/성희롱"

        for i in range(1, len(jumplist_list)):
            # "2021-11-12 14:08:14.424491"
            artifact_timestamp = jumplist_list[i].split(',')[4]

            # "2021-11-12 14:08:14.424491" -> "2021-11-12/14:08:14.424491"
            artifact_date_item = artifact_timestamp.replace(' ', '/')

            # "2021-11-12/14:08:14.424491" -> "2021-11-12/14:08:14" -> 2021-11-12/14:08:14
            artifact_date_item = artifact_date_item.split('.')[0] + "\""
            artifact_date_item = artifact_date_item.replace('"','')

            # "LNK_File" or "JumpList"
            artifact_type = jumplist_list[i].split(',')[27]

            if "1700-01-01" not in artifact_timestamp:
                flag = 0
                time_obj = datetime.datetime.strptime(artifact_timestamp, '\"%Y-%m-%d %H:%M:%S.%f\"').timestamp()

                for r in range(len(self.parent.dateList)):
                    if time_obj >= self.parent.dateList[r][0] and time_obj <= self.parent.dateList[r][1]:
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
                            if artifact_item_ext in ext_list: 
                                self.parent.result.append("링크 파일" + "," + artifact_date_item + "," + artifact_item_name + "," + "문서 열람" + "," + "icon_" + artifact_item_ext + "," + label + "," + artifact_item_path)
                            else:
                                self.parent.result.append("링크 파일" + "," + artifact_date_item + "," + artifact_item_name + "," + "파일 열람" + "," + "icon_file" + "," + label + "," + artifact_item_path)
                        # folder
                        else:      
                            self.parent.result.append("링크 파일" + "," + artifact_date_item + "," + artifact_item_name + "," + "폴더 열람" + "," + "icon_folder" + "," + label + "," + artifact_item_path)

                    elif "JumpList" in artifact_type:
                        self.parent.doc_cnt += 1

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
                                self.parent.result.append("점프 리스트" + "," + artifact_date_item + "," + artifact_item_name + "," + "문서 열람" + "," + "icon_" + artifact_item_ext + "," + label + "," + artifact_item_path)
                            else:
                                self.parent.result.append("점프 리스트" + "," + artifact_date_item + "," + artifact_item_name + "," + "파일 열람" + "," + "icon_file" + "," + label + "," + artifact_item_path)
                        # folder
                        else:
                            self.parent.result.append("점프 리스트" + "," + artifact_date_item + "," + artifact_item_name + "," + "폴더 열람" + "," + "icon_folder" + "," + label + "," + artifact_item_path)
    
                    else:
                        print("wrong data")

        self.parent.label_doc_step3.setText(str(self.parent.doc_cnt) + " 건")
        print("Jumplist completed")
                    

class recyclebinParse(QThread):
    def __init__(self, parent):
        super().__init__(parent)
        self.parent = parent

    def run(self):
        list = Recycle()

        for r in range(len(list)):
            flag = 0
            time_obj = datetime.datetime.strptime(list[r].split(',')[1], '%Y-%m-%d/%H:%M:%S').timestamp()

            for k in range(len(self.parent.dateList)):
                if time_obj >= self.parent.dateList[k][0] and time_obj <= self.parent.dateList[k][1]:
                    flag += 1

            if flag > 0:
                self.parent.recycle_cnt += 1
                self.parent.result.append(list[r])

        self.parent.label_recycle_step3.setText(str(self.parent.recycle_cnt) + " 건")
        print("RecycleBin completed")


class historyParse(QThread):
    def __init__(self, parent):
        super().__init__(parent)
        self.parent = parent

    def run(self):
        outputs = get_history()
        label = "사적지시/전가/업무제외/SNS/초과근무/건의/제출강요/행사/장기자랑강요/후원강요/모임/소문/비밀/성희롱"

        for r in range(len(outputs.histories)):
            flag = 0
            time_obj = (outputs.histories[r][0]).timestamp()

            for k in range(len(self.parent.dateList)):
                if time_obj >= self.parent.dateList[k][0] and time_obj <= self.parent.dateList[k][1]:
                    flag += 1

            if flag > 0:
                self.parent.web_cnt += 1

                # artifact_timestamp (epoch time)
                # artifact_date_item (str)

                artifact_timestamp = outputs.histories[r][0]
                artifact_date_item = artifact_timestamp.strftime('%Y-%m-%d/%H:%M:%S.%f').split('.')[0]

                # ex)
                # artifact_item
                # 파일 다운로드 : file:///C:/Users/user/Downloads/~~~
                # 인터넷 검색   : https://www.google.com/search?q=~~~ 
                # 웹사이트 방문 : https://www.naver.com/ 

                artifact_item = outputs.histories[r][1]

                if artifact_item.split('/')[0] in "file:":
                    self.parent.result.append("웹 히스토리" + "," + artifact_date_item + ",\"" + artifact_item + "\"," + "파일 다운로드" + "," + "icon_filedown" + "," + label)

                elif artifact_item.split('/')[3].split('?')[0] == "search":
                    self.parent.result.append("웹 히스토리" + "," + artifact_date_item + ",\"" + artifact_item + "\"," + "인터넷 검색" + "," + "icon_search" + "," + label)

                else:
                    self.parent.result.append("웹 히스토리" + "," + artifact_date_item + ",\"" + artifact_item + "\"," + "웹사이트 방문" + "," + "icon_visit" + "," + label)

        self.parent.label_web_step3.setText(str(self.parent.web_cnt) + " 건")
        print("History completed")


class stickyParse(QThread):
    def __init__(self, parent):
        super().__init__(parent)
        self.parent = parent

    def run(self):
        sntFile = "C:\\Users\\{}\\AppData\\Roaming\\Sticky Notes\\StickyNotes.snt".format(os.getlogin())
        plumFile = "C:\\Users\\{}\\AppData\\Local\\Packages\\Microsoft.MicrosoftStickyNotes_8wekyb3d8bbwe\\LocalState\\plum.sqlite".format(os.getlogin())

        label = "사적지시/전가/SNS/초과근무/감시/휴가/육아휴직"

        if os.path.isfile(sntFile):
            list = snt(sntFile)
        else:
            list = plum(plumFile)

        for r in range(len(list)):
            flag = 0
            time_obj = list[r][2] 

            for k in range(len(self.parent.dateList)):
                if time_obj >= self.parent.dateList[k][0] and time_obj <= self.parent.dateList[k][1]:
                    flag += 1

            # "2021-11-12 14:08:14.424491" -> "2021-11-12/14:08:14.424491"
            artifact_date_item = list[r][1]
            artifact_date_item = artifact_date_item.replace(' ', '/')

            if flag > 0:
                if ''.join(list[r][0]) != "None":
                    self.parent.doc_cnt += 1
                    self.parent.result.append("스티커 노트" + "," + artifact_date_item + "," + '+'.join(list[r][0]) + "," + "스티커 노트에 저장된 텍스트" + "," + "icon_sticky" + "," + label) 

        self.parent.label_doc_step3.setText(str(self.parent.doc_cnt) + " 건")
        print("StickyNote completed")
    

class eventlogParse(QThread):
    def __init__(self, parent):
        super().__init__(parent)
        self.parent = parent

    def run(self):
        security_evtx_path = "C:\\Windows\\System32\\winevt\\Logs\\Security.evtx"
        system_evtx_path = "C:\\Windows\\System32\\winevt\\Logs\\System.evtx"

        label = "정보차단/사적지시/전가/SNS/초과근무/휴가/육아휴직"

        list = []
        
        for r in range(len(self.parent.dateList)):

            start = self.parent.dateList[r][0]
            end = self.parent.dateList[r][1]

            with evtx_dump.evtx.Evtx(security_evtx_path) as log:
                prev_time = 0
                prev_item = ""

                for record in log.records():
                    tmp = evtx_dump.get_log(record.xml())
                    if tmp != None:
                        if prev_time != 0:
                            if prev_item == tmp[3] and prev_time + 60 > tmp[1]:
                                pass
                            else:
                                if tmp[1] >= start and tmp[1] <= end:
                                    list.append(tmp)

                        else:
                            if tmp[1] >= start and tmp[1] <= end:
                                list.append(tmp)

                        prev_time = tmp[1]
                        prev_item = tmp[3]
                        
            """ with evtx_dump.evtx.Evtx(system_evtx_path) as log:
                for record in log.records():
                    tmp = evtx_dump.get_log(record.xml())
                    if tmp != None:
                        if tmp[1] >= start and tmp[1] <= end:
                            list.append(tmp) """

        for r in range(len(list)):
            self.parent.evt_cnt += 1
            self.parent.result.append("이벤트 로그" + "," + list[r][0].replace(' ', '/').split('.')[0] + "," + "컴퓨터 관리 기록" + "," + list[r][2] + "," + "icon_system_" + list[r][3] + "," + label)

        self.parent.label_evt_step3.setText(str(self.parent.evt_cnt) + " 건")
        print("Eventlog completed")

    
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
        self.oldPos = event.globalPos()

    def mouseMoveEvent(self, event):
        delta = QPoint (event.globalPos() - self.oldPos)
        self.move(self.x() + delta.x(), self.y() + delta.y())
        self.oldPos = event.globalPos()


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
        self.oldPos = event.globalPos()

    def mouseMoveEvent(self, event):
        delta = QPoint (event.globalPos() - self.oldPos)
        self.move(self.x() + delta.x(), self.y() + delta.y())
        self.oldPos = event.globalPos()


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
        self.oldPos = event.globalPos()

    def mouseMoveEvent(self, event):
        delta = QPoint (event.globalPos() - self.oldPos)
        self.move(self.x() + delta.x(), self.y() + delta.y())
        self.oldPos = event.globalPos()


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
        self.oldPos = event.globalPos()

    def mouseMoveEvent(self, event):
        delta = QPoint (event.globalPos() - self.oldPos)
        self.move(self.x() + delta.x(), self.y() + delta.y())
        self.oldPos = event.globalPos()


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
        self.oldPos = event.globalPos()

    def mouseMoveEvent(self, event):
        delta = QPoint (event.globalPos() - self.oldPos)
        self.move(self.x() + delta.x(), self.y() + delta.y())
        self.oldPos = event.globalPos()

class loadingScreenDialog(QDialog, form_loadingDialog):
    def __init__(self):
        super(loadingScreenDialog, self).__init__()
        self.initUI()
        self.show()

    def initUI(self):
        self.setupUi(self)
        self.setWindowFlag(QtCore.Qt.FramelessWindowHint)
        self.setAttribute(QtCore.Qt.WA_TranslucentBackground)

        self.movie = QMovie(resource_path("icons8-spinner.gif"))
        self.stopBtn_progress.clicked.connect(self.stopBtnClick)

        self.movie = QMovie(resource_path("icons\\spinner.gif"))
        self.movie.setCacheMode(QMovie.CacheAll)
        self.loadingLabel.setMovie(self.movie)
        self.movie.start()

        timer = QTimer(self)
        timer.singleShot(1000, self.stopAnimation)

    def stopBtnClick(self):
        self.close()

    def stopAnimation(self):
        for i in range(0, 101):
            self.num = i
            self.progressBar.setValue(self.num)
            time.sleep(1.5)
        
        self.close()

        
class helpDialog_step1(QDialog, form_helpDialog_step1):
    def __init__(self):
        super(helpDialog_step1, self).__init__()
        self.initUI()
        self.show()
    
    def initUI(self):
        self.setupUi(self)
        self.setWindowFlag(QtCore.Qt.FramelessWindowHint)
        self.setAttribute(QtCore.Qt.WA_TranslucentBackground)
        
        self.okBtn_help.clicked.connect(self.okBtnClick)
    
    def okBtnClick(self):
        self.close()

    def mousePressEvent(self, event):
        self.oldPos = event.globalPos()

    def mouseMoveEvent(self, event):
        delta = QPoint (event.globalPos() - self.oldPos)
        self.move(self.x() + delta.x(), self.y() + delta.y())
        self.oldPos = event.globalPos()


# If user didn't select bullying, show a warning dialog
class helpDialog_step2(QDialog, form_helpDialog_step2):
    def __init__(self):
        super(helpDialog_step2, self).__init__()
        self.initUI()
        self.show()
    
    def initUI(self):
        self.setupUi(self)
        self.setWindowFlag(QtCore.Qt.FramelessWindowHint)
        self.setAttribute(QtCore.Qt.WA_TranslucentBackground)
        
        self.okBtn_help.clicked.connect(self.okBtnClick)
    
    def okBtnClick(self):
        self.close()

    def mousePressEvent(self, event):
        self.oldPos = event.globalPos()

    def mouseMoveEvent(self, event):
        delta = QPoint (event.globalPos() - self.oldPos)
        self.move(self.x() + delta.x(), self.y() + delta.y())
        self.oldPos = event.globalPos()

if __name__ == "__main__":
    app = QApplication(sys.argv)
    main_window = MainWindow()
    main_window.show()
    app.exec_()
