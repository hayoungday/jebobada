import hashlib

def calculate_hash(f):
    res=hashlib.md5(f.read()).hexdigest()
    return res