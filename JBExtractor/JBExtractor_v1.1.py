import os
import sys
import time
import datetime
import webbrowser

from PyQt5 import uic
from PyQt5 import QtCore
from PyQt5.QtCore import QPoint, QTimer, Qt, QDateTime
from PyQt5.QtWidgets import *
from PyQt5.QtGui import *

import pandas as pd

from windowsprefetch import Prefetch
from JLParser import JL
from recycleParser import Recycle
from browser_history import get_history

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

# Main Window
class MainWindow(QMainWindow, form_mainWindow):
    def __init__(self):
        super().__init__()
        self.initUI()
        self.show()
    
    def initUI(self):
        # Setting loaded UI
        self.setupUi(self)
        icon_path = resource_path("JBExtractor_logo.png")
        self.setWindowIcon(QIcon(icon_path))
        self.setWindowFlag(QtCore.Qt.FramelessWindowHint)
        self.setAttribute(QtCore.Qt.WA_TranslucentBackground)

    #------------------------------------------------------------------------------#
        # Signal of main screen
        self.nextBtn_main.clicked.connect(self.nextBtnClick)
        self.exitBtn_main.clicked.connect(self.exitBtnClick)
        self.minBtn_main.clicked.connect(self.showMinimized)
        self.homeBtn_main.clicked.connect(self.homeBtnClick)
        self.internetBtn_main.clicked.connect(lambda: webbrowser.open('http://gabjil119.co.kr/'))

    #------------------------------------------------------------------------------#
        # Signal of step1 screen
        self.nextBtn_step1.clicked.connect(self.nextBtnClick_step1)
        self.backBtn_step1.clicked.connect(self.backBtnClick)
        self.exitBtn_step1.clicked.connect(self.exitBtnClick)
        self.minBtn_step1.clicked.connect(self.showMinimized)
        self.helpBtn_step1.clicked.connect(self.helpBtn_step1Click)
        self.homeBtn_step1.clicked.connect(self.homeBtnClick)
        self.internetBtn_step1.clicked.connect(lambda: webbrowser.open('http://gabjil119.co.kr/'))

        self.todayLine_step1.setText(datetime.datetime.strftime(datetime.datetime.today(), '%Y-%m-%d %p %I:%M'))
        self.startDate_step1.setDateTime(QDateTime.currentDateTime())
        self.endDate_step1.setDateTime(QDateTime.currentDateTime())

        self.addDateBtn_step1.clicked.connect(self.addDateBtnClick)
        self.delDateBtn_step1.clicked.connect(self.delDateBtnClick)

        self.comboBox_step1.activated[str].connect(lambda: self.selectComboItem(self.comboBox_step1))

    #------------------------------------------------------------------------------#
        # Signal of step2 screen
        self.backBtn_step2.clicked.connect(self.backBtnClick)
        self.exitBtn_step2.clicked.connect(self.exitBtnClick)
        self.minBtn_step2.clicked.connect(self.showMinimized)
        self.helpBtn_step2.clicked.connect(self.helpBtn_step2Click)
        self.homeBtn_step2.clicked.connect(self.homeBtnClick)
        self.internetBtn_step2.clicked.connect(lambda: webbrowser.open('http://gabjil119.co.kr/'))


        self.extractBtn_step2.clicked.connect(self.startExtractClick)


    #------------------------------------------------------------------------------#
        # Sigal of step3 screen
        self.backBtn_step3.clicked.connect(self.backBtnClick)
        self.exitBtn_step3.clicked.connect(self.exitBtnClick)
        self.minBtn_step3.clicked.connect(self.showMinimized)
        self.homeBtn_step3.clicked.connect(self.homeBtnClick)
        self.internetBtn_step3.clicked.connect(lambda: webbrowser.open('http://gabjil119.co.kr/'))

        self.downAnalysisBtn_step3.clicked.connect(self.downAnalysisBtnClick)

    #------------------------------------------------------------------------------#
        # Signal of step4 screen
        self.nextBtn_step4.clicked.connect(self.nextBtnClick)
        self.backBtn_step4.clicked.connect(self.backBtnClick)
        self.exitBtn_step4.clicked.connect(self.exitBtnClick)
        self.minBtn_step4.clicked.connect(self.showMinimized)
        self.homeBtn_step4.clicked.connect(self.homeBtnClick)
        self.internetBtn_step4.clicked.connect(lambda: webbrowser.open('http://gabjil119.co.kr/'))

        self.uploadBtn_step4.clicked.connect(lambda: webbrowser.open('http://gabjil119.co.kr/'))
        

    #------------------------------------------------------------------------------#
        # Signal of step5 screen
        self.backBtn_step5.clicked.connect(self.backBtnClick)
        self.exitBtn_step5.clicked.connect(self.exitBtnClick)
        self.minBtn_step5.clicked.connect(self.showMinimized)
        self.homeBtn_step5.clicked.connect(self.homeBtnClick)
        self.internetBtn_step5.clicked.connect(lambda: webbrowser.open('http://gabjil119.co.kr/'))
        
        self.startBtn_step5.clicked.connect(self.homeBtnClick)
        self.endBtn_step5.clicked.connect(self.exitBtnClick)


    def nextBtnClick(self):
        index = self.stackedWidget.currentIndex()
        self.stackedWidget.setCurrentIndex((index + 1))

    def nextBtnClick_step1(self):
        if self.dateList_step1.count() == 0:
            self.help_step1_2 = warningDialog_step1_2()
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

    def startExtractClick(self):
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

        print(self.dateList)
        self.loading = loadingScreenDialog()
    
        self.prefetchParse()
        self.jumplistParse()
        self.nextBtnClick()
        self.recycleParse()
        #self.lnkParse()
        self.historyParse()
        #self.eventlogParse()

    def addDateBtnClick(self):
        start_time = self.startDate_step1.dateTime()
        end_time = self.endDate_step1.dateTime()

        start_time_epoch = start_time.toTime_t()
        end_time_epoch = end_time.toTime_t()

        if start_time_epoch > end_time_epoch:
            self.help_step1_1 = warningDialog_step1_1()
        else:
            self.dateList_step1.addItem(datetime.datetime.fromtimestamp(start_time_epoch).strftime('%Y-%m-%d %p %I:%M') + " ~ " + datetime.datetime.fromtimestamp(end_time_epoch).strftime('%Y-%m-%d %p %I:%M'))

    def delDateBtnClick(self):
        if self.dateList_step1.count() > 0:
            row = self.dateList_step1.currentRow()
            if row > -1:
                self.dateList_step1.takeItem(row)
            else:
                self.help_step1_3 = warningDialog_step1_3()
        else:
            self.help_step1_2 = warningDialog_step1_2()

    def selectComboItem(self, item):
        now_time = datetime.datetime.today().timestamp()
        if item.currentText() == "한시간":
            tmp_time = now_time - 3600
            self.dateList_step1.addItem(datetime.datetime.fromtimestamp(tmp_time).strftime('%Y-%m-%d %p %I:%M') + " ~ " + datetime.datetime.today().strftime('%Y-%m-%d %p %I:%M'))
        elif item.currentText() == "당일":
            tmp_time = now_time - 86400
            self.dateList_step1.addItem(datetime.datetime.fromtimestamp(tmp_time).strftime('%Y-%m-%d %p %I:%M') + " ~ " + datetime.datetime.today().strftime('%Y-%m-%d %p %I:%M'))
        elif item.currentText() == "3일":
            tmp_time = now_time - 259200
            self.dateList_step1.addItem(datetime.datetime.fromtimestamp(tmp_time).strftime('%Y-%m-%d %p %I:%M') + " ~ " + datetime.datetime.today().strftime('%Y-%m-%d %p %I:%M'))
        elif item.currentText() == "1주":
            tmp_time = now_time - 604800
            self.dateList_step1.addItem(datetime.datetime.fromtimestamp(tmp_time).strftime('%Y-%m-%d %p %I:%M') + " ~ " + datetime.datetime.today().strftime('%Y-%m-%d %p %I:%M'))
        elif item.currentText() == "2주":
            tmp_time = now_time - 1209600
            self.dateList_step1.addItem(datetime.datetime.fromtimestamp(tmp_time).strftime('%Y-%m-%d %p %I:%M') + " ~ " + datetime.datetime.today().strftime('%Y-%m-%d %p %I:%M'))
        elif item.currentText() == "1개월":
            tmp_time = now_time - 2592000
            self.dateList_step1.addItem(datetime.datetime.fromtimestamp(tmp_time).strftime('%Y-%m-%d %p %I:%M') + " ~ " + datetime.datetime.today().strftime('%Y-%m-%d %p %I:%M'))
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

    def prefetchParse(self):
        prefetch_path = "C:\\Windows\\Prefetch"

        file_paths = []
        if os.path.isdir(prefetch_path):
            for filename in os.listdir(prefetch_path):
                file_paths.append(os.path.join(prefetch_path, filename))
        else:
            file_paths.append(prefetch_path)

        parsed_files = []
        self.result = []
        for filepath in file_paths:
            if filepath.endswith(".pf"):
                if os.path.getsize(filepath) > 0:
                    p = Prefetch(filepath)
                    parsed_files.append(p)

        for p in parsed_files:
            for timestamp in p.timestamps:
                flag = 0
                time_obj = datetime.datetime.strptime(timestamp, '%Y-%m-%d %H:%M:%S.%f').timestamp()

                for r in range(len(self.dateList)):
                    if time_obj >= self.dateList[r][0] and time_obj <= self.dateList[r][1]:
                        flag += 1
                    
                if flag > 0:
                    self.result.append("{},{},{},{},{},{}".format(
                        "프리패치",
                        timestamp.replace(' ', '/').split('.')[0],
                        p.executableName,
                        "프로그램 실행",
                        "icon_exec",
                        "사적지시/초과근무/전가/제출강요"
                    ))
                    
    def jumplistParse(self):
        appid_path = os.path.dirname(os.path.abspath(__file__)) + '/JLParser_AppID.csv'

        jumplist_item = JL("C:\\Users\\{}\\AppData\\Roaming\\Microsoft\\Windows\\Recent".format(os.getlogin()), appid_path)
        jumplist_list = jumplist_item.result.split('\n') # string to list

        extlist = ['docx', 'xlsx', 'xls', 'ppt', 'pdf', 'txt', 'hwp', 'csv']
        label = "초과근무/제출강요"

        for i in range(1, len(jumplist_list)):
            if "1700-01-01" not in jumplist_list[i].split(',')[4]:
                flag = 0
                time_obj = datetime.datetime.strptime(jumplist_list[i].split(',')[4], '\"%Y-%m-%d %H:%M:%S.%f\"').timestamp()

                for r in range(len(self.dateList)):
                    if time_obj >= self.dateList[r][0] and time_obj <= self.dateList[r][1]:
                        flag += 1
                
                if flag > 0:
                    if "LNK_File" in jumplist_list[i].split(',')[27]:
                        date_item = jumplist_list[i].split(',')[4].replace(' ', '/')
                        date_item = date_item.split('.')[0] + "\""
                        extention = jumplist_list[i].split(',')[25].split('.')
                        if len(extention) > 2:
                            if extention[-2].split(' ')[0].lower() in extlist: 
                                self.result.append("링크 파일" + "," + date_item + "," + jumplist_list[i].split(',')[25] + "," + "문서 열람" + "," + "icon_" + extention[-2].split(' ')[0] + "," + label)
                            else:
                                self.result.append("링크 파일" + "," + date_item + "," + jumplist_list[i].split(',')[25] + "," + "파일 열람" + "," + "icon_" + extention[-2].split(' ')[0] + "," + label)
                        else:      
                            self.result.append("링크 파일" + "," + date_item + "," + jumplist_list[i].split(',')[25] + "," + "폴더 열람" + "," + "icon_folder" + "," + label)

                    elif "JumpList" in jumplist_list[i].split(',')[27]:
                        item = jumplist_list[i].split(',')[14].split('\\')
                        date_item = jumplist_list[i].split(',')[4].replace(' ', '/')
                        date_item = date_item.split('.')[0] + "\""
                        extention = item[-1].replace('"','').split('.')
                        if len(extention) > 1:
                            if extention[-1].split(' ')[0].lower() in extlist:                           
                                self.result.append("점프 리스트" + "," + date_item + "," + item[-1].replace('"','') + "," + "문서 열람" + "," + "icon_" + extention[-1].split(' ')[0] + "," + label)
                            else:
                                self.result.append("점프 리스트" + "," + date_item + "," + item[-1].replace('"','') + "," + "파일 열람" + "," + "icon_" + extention[-1].split(' ')[0] + "," + label)
                        else:
                            self.result.append("점프 리스트" + "," + date_item + "," + item[-1].replace('"','') + "," + "폴더 열람" + "," + "icon_folder" + "," + label)

                    else:
                        print("wrong data")
                    
    def lnkParse(self):
        dirname = "C:\\Users\\{}\\AppData\\Roaming\\Microsoft\\Windows\\Recent".format(os.getlogin())
        filenames = os.listdir(dirname)
        for filename in filenames:
            full_filename = os.path.join(dirname, filename)
            print(os.system("lnkparse " + full_filename))

    #pip install browser-history
    def historyParse(self):
        outputs = get_history()
        label = "SNS/사적지시"
        for r in range(len(outputs.histories)):
            flag = 0
            time_obj = (outputs.histories[r][0]).timestamp()
            for k in range(len(self.dateList)):
                if time_obj >= self.dateList[k][0] and time_obj <= self.dateList[k][1]:
                    flag += 1
            if flag > 0:
                if outputs.histories[r][1].split('/')[0] in "file:":
                    self.result.append("웹 히스토리" + "," + (outputs.histories[r][0]).strftime('%Y-%m-%d/%H:%M:%S.%f').split('.')[0] + "," + outputs.histories[r][1].replace(',', '') + "," + "파일 다운로드" + "," + "icon_filedown" + "," + label)
                elif outputs.histories[r][1].split('/')[3].split('?')[0] == "search":
                    self.result.append("웹 히스토리" + "," + (outputs.histories[r][0]).strftime('%Y-%m-%d/%H:%M:%S.%f').split('.')[0] + "," + outputs.histories[r][1] + "," + "인터넷 검색" + "," + "icon_search" + "," + label)
                else:
                    self.result.append("웹 히스토리" + "," + (outputs.histories[r][0]).strftime('%Y-%m-%d/%H:%M:%S.%f').split('.')[0] + "," + outputs.histories[r][1] + "," + "웹사이트 방문" + "," + "icon_visit" + "," + label)
                #print(outputs.histories[r][1].split('/'))

    def recycleParse(self):
        list = Recycle()
        for r in range(len(list)):
            flag = 0
            time_obj = datetime.datetime.strptime(list[r].split(',')[1], '%Y-%m-%d/%H:%M:%S').timestamp()
            for k in range(len(self.dateList)):
                if time_obj >= self.dateList[k][0] and time_obj <= self.dateList[k][1]:
                    flag += 1
            if flag > 0:
                self.result.append(list[r])


    def eventlogParse(self):
        print()

    def downAnalysisBtnClick(self):
        
        Filename_tmp = "컴퓨터 사용기록 추출결과"

        Filesave = QFileDialog.getSaveFileName(self, '파일 저장', Filename_tmp + "-" + str(datetime.datetime.now().date()), "csv files (*.csv)")
        FileHeader = ["타입, 시간, 이름, 설명, 아이콘, 라벨링"]

        if Filesave[0] != "":
            with open(Filesave[0], "w") as f:
                for r in range(self.dateList_step1.count()):
                    f.writelines(self.dateList_step1.item(r).text())
                    f.write(',')
                f.write('\n')
                f.writelines(FileHeader)
                f.write('\n')
                for r in range(len(self.result)):
                    f.writelines(self.result[r])
                    f.write('\n')
                f.write('\n')

            buttonReply = QMessageBox.information(self, "증거파일 저장", Filesave[0] + " 이 저장되었습니다.", QMessageBox.Ok)
            self.statusBar().showMessage(Filesave[0])
        else:
            buttonReply = QMessageBox.information(self, "증거파일 저장", "파일이 저장되지 않았습니다.", QMessageBox.Ok)

    
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
        self.loadingLabel.setMovie(self.movie)
        self.movie.start()

        timer = QTimer(self)
        timer.singleShot(1000, self.stopAnimation)

    def stopAnimation(self):
        for i in range(0, 101):
            self.num = i
            self.progressBar.setValue(self.num)
            time.sleep(0.01)
        
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
