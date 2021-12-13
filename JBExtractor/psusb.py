import subprocess
import socket
import datetime

def usbParse(begin, end):
    
    list = []

    weekofday = ['일요일 ', '월요일 ', '화요일 ', '수요일 ', '목요일 ', '금요일 ', '토요일 ']
    computerName = socket.gethostname()

    usb_time_cmd = "Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-Storage-ClassPnP/Operational';ID=507;StartTime=" + begin + ";EndTime=" + end + "} | where {$_.MachineName -eq \"" + computerName + "\"} | % {$_.TimeCreated}"
    usb_name_cmd = "Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-Storage-ClassPnP/Operational';ID=507;StartTime=" + begin + ";EndTime=" + end + "} | where {$_.MachineName -eq \"" + computerName + "\"} | % {$_.properties[2].value + \" \" + $_.properties[3].value}"

    usb_time = subprocess.run(['powershell', '-Command', usb_time_cmd], shell=True, capture_output=True, stdin=subprocess.PIPE, encoding='cp949', errors='ignore')
    usb_time_list = usb_time.stdout.split('\n')
    del usb_time_list[0:1]
    del usb_time_list[-3:]
    
    usb_name = subprocess.run(['powershell', '-Command', usb_name_cmd], shell=True, capture_output=True, stdin=subprocess.PIPE, encoding='cp949', errors='ignore')
    usb_name_list = usb_name.stdout.split('\n')
    del usb_name_list[-1:]

    for r in range(len(usb_time_list)):
        for k in range(len(weekofday)):
            if weekofday[k] in usb_time_list[r]:
                usb_time_list[r] = usb_time_list[r].replace(weekofday[k], "")
                if "오전" in usb_time_list[r]:
                    usb_time_list[r] = usb_time_list[r].replace("오전", "am")
                else:
                    usb_time_list[r] = usb_time_list[r].replace("오후", "pm")

        timestamp = datetime.datetime.strptime(usb_time_list[r], '%Y년 %m월 %d일 %p %H:%M:%S').timestamp()
        date_item = datetime.datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d/%H:%M:%S')

        list.append(date_item + "," + usb_name_list[r])

    return list
