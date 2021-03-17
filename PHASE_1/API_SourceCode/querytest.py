import pyrebase
import requests
import json
import time

config = {
  "apiKey": "AIzaSyB2BT5PcLAlDxhVl2E7xcusZQFgOWiaqko",
  "authDomain": "seng3011-306108.firebaseapp.com",
  "databaseURL": "https://seng3011-306108-default-rtdb.firebaseio.com",
  "storageBucket": "seng3011-306108.appspot.com"
}

firebase = pyrebase.initialize_app(config)

db = firebase.database()

request_time = time.time()


retval = {}
log = {}
log["team_name"] = "SENG3011 200OK"
log["data_source"] = "Centers for Disease Control and Prevention"
log["request_time"] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

key_terms = "health,Zika"
key_terms = key_terms.split(",")
location = "korean"
start_date = "2020-01-10"
end_date = "2021-01-20"

report_menu = []

all_data = db.child("report").get()
i = 0
for data in all_data.each():
    if data.val() is not None:
        if end_date > data.val()["date_of_publication"] > start_date:
            t = False
            for report in data.val()["reports"]:
                for locset in report["locations"]:
                    if location.lower() in locset["country"].lower() or location.lower() in locset["location"].lower():
                        if len(key_terms) == 0:
                            retval[i] = data.val()
                            i = i + 1
                        else:
                            for term in key_terms:
                                if term.lower() in data.val()["main_text"].lower():
                                    retval[i] = data.val()
                                    report_menu.append(data.key())
                                    i = i + 1
                                    break
                        t = True
                        break
                if t:
                    break



response_time = time.time()
time_spent = response_time - request_time
log["time_spent"] = time_spent

retval["log"] = log


local_log = {}
local_log["request_time"] = log["request_time"]
local_log["time_spent"] = time_spent
local_log["report_found"] = i
local_log["report_menu"] = report_menu
end_point = "https://australia-southeast1-seng3011-306108.cloudfunctions.net/API_test-1?start_date=2020-01-10&end_date=2021-01-20&location=korean&key_terms=health,Zika"
local_log["end_point"] = end_point

db.child("logs").push(local_log)

if not retval:
    print("No relevent data")
else:
    print(retval)