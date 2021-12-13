import subprocess
import os
import datetime

def run_ps(cmd):
    list = []
    sp = subprocess.run(['powershell', '-Command', cmd], shell=True, capture_output=True, stdin=subprocess.PIPE, encoding='cp949', errors='ignore')
    logs = sp.stdout.split('\n')
    prev_timestamp = 0
    prev_id = ""

    del logs[0:3]
    del logs[-3:]
    for r in range(len(logs)):
        logs[r] = logs[r].replace('  ', ' ')
        if "~" in logs[r]:
            break
        else:
            try:
                day, ap, time, tmp, id = logs[r].split(' ')
            except:
                day, ap, time, id = logs[r].split(' ')

            if ap == "오전":
                ap = "am"
            else:
                ap = "pm"

            timestamp = datetime.datetime.strptime(day + " " + ap + " " + time, '%Y-%m-%d %p %I:%M:%S').timestamp()
            date = datetime.datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d/%H:%M:%S')

            if id == "42":
                list.append(str(timestamp) + "," + date + "," + "절전 모드 전환" + "," + id)
            elif id == "1":
                list.append(str(timestamp) + "," + date + "," + "절전 모드 해제" + "," + id)
            elif id == "7002" or id == "4647":
                list.append(str(timestamp) + "," + date + "," + "컴퓨터 로그오프" + "," + id)
            elif id == "4625":
                list.append(str(timestamp) + "," + date + "," + "컴퓨터 로그인 실패" + "," + id)
            elif id == "4624":
                if prev_id == id and prev_timestamp - 60 < timestamp and prev_timestamp + 60 > timestamp:
                    pass
                else:
                    list.append(str(timestamp) + "," + date + "," + "컴퓨터 로그인 성공" + "," + id)
            elif id == "4723":
                list.append(str(timestamp) + "," + date + "," + "계정 암호 변경" + "," + id)
            
            prev_timestamp = timestamp
            prev_id = id
     
    return list


def evtParse(begin, end):

    list = []
    user = os.getlogin()

    sid_cmd = "get-localuser -name " + user + " | select sid"
    get_sid = subprocess.run(['powershell', '-Command', sid_cmd], shell=True, capture_output=True, stdin=subprocess.PIPE, encoding='utf-8', errors='ignore')
    sid = get_sid.stdout.split('\n')[3]

    powersave_on_cmd = "Get-WinEvent -FilterHashtable @{LogName='System';ID=42;ProviderName=\"Microsoft-Windows-Kernel-Power\"" + ";StartTime=" + begin + ";EndTime=" + end + "} | select TimeCreated, ID | Format-Table -AutoSize"
    powersave_off_cmd = "Get-WinEvent -FilterHashtable @{LogName='System';ID=1;ProviderName=\"Microsoft-Windows-Power-Troubleshooter*\"" + ";StartTime=" + begin + ";EndTime=" + end + "} | select TimeCreated, ID | Format-Table -AutoSize"
    logon1_cmd = "Get-WinEvent -FilterHashtable @{LogName='Security';ID=7002,4647,4625" + ";StartTime=" + begin + ";EndTime=" + end + "} | select TimeCreated, ID | Format-Table -AutoSize"
    logon2_cmd = "Get-WinEvent -FilterHashtable @{Logname='Security';ID=4624,4634;Data=\"" + sid + "\";StartTime=" + begin + ";EndTime=" + end + "} | select TimeCreated, ID | Format-Table -AutoSize"
    window_log_cmd = "Get-WinEvent -FilterHashtable @{Logname='Security';ID=4723;StartTime=" + begin + ";EndTime=" + end + "} | select TimeCreated, ID | Format-Table -AutoSize"

    result = run_ps(powersave_on_cmd)
    if len(result) > 0:
        list.append(result)

    result = run_ps(powersave_off_cmd)
    if len(result) > 0:
        list.append(result)

    result = run_ps(logon1_cmd)
    if len(result) > 0:
        list.append(result)
    
    result = run_ps(logon2_cmd)
    if len(result) > 0:
        list.append(result)

    result = run_ps(window_log_cmd)
    if len(result) > 0:
        list.append(result)

    return list
