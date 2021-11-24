import os
import logging

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


def activitiesParse():
    list = []

    abs_path = "C:\\Users\\{}\\".format(os.getlogin())
    source = abs_path + "AppData\\Local\\ConnectedDevicesPlatform\\L.{}\\ActivitiesCache.db".format(os.getlogin())
    output_template = "{LastModifiedTime} - {AppId[0][application]}"

    formatter = CustomStringFormatter()
    activities_db = ActivitiesDb(source)

    for record in activities_db.iter_activities(0):
        formatted_record = record.as_ordered_dict()

        output = formatter.format(output_template, **formatted_record)
        list.append(output)
    
    return list



