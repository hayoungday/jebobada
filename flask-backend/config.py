from re import VERBOSE
import pymongo
import os
from dotenv import load_dotenv

load_dotenv(verbose=True)

mode = os.environ['MODE']
secret_key = os.environ['JWT_SECRET_KEY']
mongodb = os.environ['LOCAL_DB']


# if mode == "develp":
#     mongodb = os.environ['LOCAL_DB']
    
# elif mode == "production":
#     mongodb = os.environ['LOCAL_DB']