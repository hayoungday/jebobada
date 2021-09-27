from flask import Flask
from flask.json import JSONEncoder
import bson, json, datetime


class MongoEngineJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, bson.objectid.ObjectId):
            return str(obj)
        elif isinstance(obj, datetime.datetime):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)