import csv,hashlib


def change_date(data):
    data=' '.join(data).split()
    return (data)
def change(data):
    try:
        if(data[0]=='웹 히스토리'):
            data[2]="\""+data[2]+"\""
    except:
        pass
    tmp=(','.join(data))
    try:
        if((tmp[-1])==','):
            while(True):
                if(tmp[-1]!=','):
                    break
                else:
                    tmp=tmp[:-1]
    except:
        pass
    return str(tmp)

def calculate_hash(data):
    encoding_data=str(data).encode()
    hash_value = hashlib.sha256(encoding_data).hexdigest()
    return hash_value

def check_csv(csvfile):
    test=csv.reader(csvfile)
    check_date_hash_value=""
    check_list_hash_value=""
    list_to_text=[]
    date_to_text=''
    tmp=0
    for line in test:
        if(tmp==0):
            check_date_hash_value=line
        if(tmp==1):
            check_list_hash_value=line
        if(tmp==2):
            date_to_text=change_date(line)
        if(tmp>3):
            list_to_text.append((change(line)))
        tmp=tmp+1

    list_to_text = list(filter(None, list_to_text))

    print(calculate_hash(date_to_text))
    print(check_date_hash_value)
    print(calculate_hash(list_to_text))
    print(check_list_hash_value)

    if(calculate_hash(date_to_text)==check_date_hash_value[0] and calculate_hash(list_to_text)==check_list_hash_value[0]):
        return 'verified success'
    else:
        return 'verified fail'