import os
import struct
import datetime
import time

class deleted_file():
    def __init__(self):
        self.date = None
        self.size = None
        self.type = ''
        self.Ifile = ''
        self.Rfile = ''
        self.filepath = ''
        self.filename = ''
        self.file_dir = ''

def to_seconds(date):
    # https://stackoverflow.com/questions/6256703/convert-64bit-timestamp-to-a-readable-value
    s = float(date) / 1e7  # convert to seconds
    seconds = s - 11644473600  # number of seconds from 1601 to 1970
    # 'Sat Jan 26 03:27:21 2019'
    return datetime.datetime.strptime(time.ctime(seconds), '%a %b %d %H:%M:%S %Y')


def Recycle():
    deleted_files = []
    RecycleBin = "C:\\$Recycle.Bin"

    # del_file = None
    if os.path.isdir(RecycleBin.strip()):
        for root, dirs, files in os.walk(RecycleBin):
            for file in files:
                if file[0:2] == '$I':
                    with open(os.path.join(root, file), "rb") as f:
                        del_file = deleted_file()
                        del_file.Ifile = os.path.join(root, file)
                        del_file.Rfile = os.path.join(root, file.replace('$I', '$R'))
                        header = f.read(8)
                        size = f.read(8)
                        del_file.size = int.from_bytes(size, byteorder='little')
                        date = f.read(8)
                        if header == b'\x02\x00\x00\x00\x00\x00\x00\x00':
                            filename_length = f.read(4)
                        del_file.filepath = str(f.read(), 'utf-16-le').replace('\x00', '').encode('ascii', 'ignore').decode('utf-8')
                        del_file.date = to_seconds(struct.unpack("<Q", date)[0])
                        del_file.filename = del_file.filepath.split('\\')[-1:][0]
                        if os.path.isdir(del_file.Rfile):
                            del_file.type = "dir"
                        elif os.path.isfile(del_file.Rfile):
                            del_file.type = "file"
                        deleted_files.append(del_file)

    elif os.path.isfile(RecycleBin.strip()):
        if os.path.basename(RecycleBin)[0:2] == '$I':
            with open(RecycleBin, "rb") as f:
                del_file = deleted_file()
                del_file.Ifile = RecycleBin.strip()
                del_file.Rfile = RecycleBin.replace('$I', '$R').strip()
                header = f.read(8)
                size = f.read(8)
                del_file.size = int.from_bytes(size, byteorder='little')
                date = f.read(8)
                if header == b'\x02\x00\x00\x00\x00\x00\x00\x00':
                    filename_length = f.read(4)
                del_file.filepath = str(f.read(), 'utf-8').replace('\x00', '').encode('ascii', 'ignore').decode('utf-8')
                del_file.date = to_seconds(struct.unpack("<Q", date)[0])
                del_file.filename = del_file.filepath.split('\\')[-1:][0]
                if os.path.isdir(del_file.Rfile):
                    del_file.type = "dir"
                elif os.path.isfile(del_file.Rfile):
                    del_file.type = "file"
                    print(del_file.Ifile)
                deleted_files.append(del_file)
                
    result = []
    extlist = ['docx', 'xlsx', 'xls', 'ppt', 'pdf', 'txt', 'hwp', 'csv']
    label = "배제/사적지시/전가/업무제외/SNS/초과근무/건의/사직종용/제출강요/행사/장기자랑강요/후원강요/휴가/육아휴직/모임/실업급여/성희롱"

    for del_file in deleted_files:
        if del_file.type == "dir":
            result.append("휴지통" + "," + str(del_file.date).replace(' ', '/') + "," + del_file.filename.strip() + "," + "폴더 삭제" + "," + "icon_folder_del" + "," + label + "," + os.path.join(del_file.filepath, file).replace("/", "\\"))
            
        else:
            extention = del_file.filename.strip().split('.')
            if len(extention) > 1:
                if extention[-1].split(' ')[0].lower() in extlist: 
                    result.append("휴지통" + "," + str(del_file.date).replace(' ', '/') + "," + del_file.filename.strip() + "," + "문서 삭제" + "," + "icon_" + extention[-1].split(' ')[0].lower() + "_del" + "," + label + "," + os.path.join(del_file.filepath, file).replace("/", "\\"))
                else:
                    result.append("휴지통" + "," + str(del_file.date).replace(' ', '/') + "," + del_file.filename.strip() + "," + "파일 삭제" + "," + "icon_file_del" + "," + label + "," + os.path.join(del_file.filepath, file).replace("/", "\\"))

    return result