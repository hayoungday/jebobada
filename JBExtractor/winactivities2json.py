import os
import logging
import re

from winactivities.activities import ActivitiesDb
from winactivities.helpers import CustomStringFormatter

VALID_DEBUG_LEVELS = ["ERROR", "WARN", "INFO", "DEBUG"]
__VERSION__ = "0.0.1"


def set_debug_level(debug_level):
    if debug_level in VALID_DEBUG_LEVELS:
        logging.basicConfig(
            level=getattr(logging, debug_level)
        )
    else:
        raise (Exception("{} is not a valid debug level.".format(debug_level)))

def search(dirname):
    filenames = os.listdir(dirname)
    for filename in filenames:
        if "L." in filename or len(filename) == 16:     
            full_filename = os.path.join(dirname, filename)
            if os.path.isfile(full_filename):
                pass
            else:
                print(full_filename)
                return full_filename


def activitiesParse():
    list = []
 
    output_template = "{LastModifiedTime} - {AppId[0][application]} - {AppActivityId}"
    formatter = CustomStringFormatter()

    abs_path = "C:\\Users\\{}\\AppData\\Local\\ConnectedDevicesPlatform\\".format(os.getlogin())
    source_path = search(abs_path)

    source = source_path + r"\ActivitiesCache.db".format(os.getlogin())
    activities_db = ActivitiesDb(source)

    for record in activities_db.iter_activities(0):
        formatted_record = record.as_ordered_dict()

        output = formatter.format(output_template, **formatted_record)
        list.append(output)
    
    return list