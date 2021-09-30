from re import VERBOSE
import pymongo
import os
from dotenv import load_dotenv

load_dotenv(verbose=True)

mode = os.environ['MODE']
secret_key = os.environ['JWT_SECRET_KEY']
mongodb = os.environ['LOCAL_DB']


# if mode == "develop":
#     clova_callback = 'http://14.138.175.117:5500/Receive'
# elif mode == "production":
#     clova_callback = 'http://218.146.20.51:20080/Receive'