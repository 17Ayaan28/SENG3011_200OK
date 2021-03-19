import pyrebase
import requests
import json
import time
import re

def cdc_report_api(request):

    request_time = time.time()
    return_log = {}
    local_log = {}
    return_log["team_name"] = "SENG3011 200OK"
    return_log["data_source"] = "Centers for Disease Control and Prevention"
    local_log["data_source"] = "CDC"
    return_log["access_time"] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    local_log["end_point"] = request.base_url + "cdc-report-api"
    
    config = {
    "apiKey": "AIzaSyB2BT5PcLAlDxhVl2E7xcusZQFgOWiaqko",
    "authDomain": "seng3011-306108.firebaseapp.com",
    "databaseURL": "https://seng3011-306108-default-rtdb.firebaseio.com",
    "storageBucket": "seng3011-306108.appspot.com"
    }
    firebase = pyrebase.initialize_app(config)

    db = firebase.database()

    rdata = db.child("data").get()
    retval = {}
    reports = []
    i = 0
    report_menu = []
    key_terms = request.args.get("key_terms")
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    location = request.args.get("location")
    trace_id = request.args.get("trace_id")
    
    if location is None:
        location = ""
    location = location.lower()
    if key_terms is not None:
        key_terms_a = key_terms.split(",")
    else:
        key_terms = ""
        key_terms_a = []
    if start_date is None:
        start_date = ""
    if end_date is None:
        end_date = ""
        
    if trace_id is not None:
        trace_id = trace_id.split(",")
        for data in rdata.each():
            for id in trace_id:
                if data.key() == id:
                    reports.append(data.val())
                    report_menu.append(data.key())
                    i = i + 1
                    break
    else:
        t_date = True
        date_pattern = '^(\d{4})-(\d\d|xx)-(\d\d|xx)T(\d\d|xx):(\d\d|xx):(\d\d|xx)$'
        if re.match(date_pattern, start_date) and re.match(date_pattern, end_date):
            start_date_m = start_date.replace("xx", "01")
            end_date_m = end_date.replace("xx", "01")
            if start_date > end_date:
                t_date = False
            try:
                time.strptime(start_date_m, "%Y-%m-%dT%H:%M:%S")
                time.strptime(end_date_m, "%Y-%m-%dT%H:%M:%S")
            except:
                t_date = False
        else:
            t_date = False
        if not t_date:
            response_time = time.time()
            time_spent = response_time - request_time
            local_log["access_time"] = return_log["access_time"]
            local_log["execution_time"] = time_spent
            local_log["report_found"] = i
            local_log["report_menu"] = report_menu
            local_log["query_parameters"] = {"start_date": start_date, "end_date": end_date, "location": location, "key_terms": key_terms}
            local_log["status_code"] = 400
            db.child("logs").push(local_log)
            return "Require valid start_date and end_date in format yyyy-mm-ddTxx:xx:xx", 400


        for data in rdata.each():
            if data.val() is not None:
                if end_date >= data.val()["date_of_publication"] >= start_date:
                    t = False
                    for report in data.val()["reports"]:
                        for locset in report["locations"]:
                            if location.lower() in locset["country"].lower() or location.lower() in locset["location"].lower():
                                if len(key_terms) == 0:
                                    reports.append(data.val())
                                    report_menu.append(data.key())
                                    i = i + 1
                                else:
                                    for term in key_terms_a:
                                        if term.lower() in data.val()["main_text"].lower():
                                            reports.append(data.val())
                                            report_menu.append(data.key())
                                            i = i + 1
                                            break
                                t = True
                                break
                        if t:
                            break

    response_time = time.time()
    time_spent = response_time - request_time

    local_log["access_time"] = return_log["access_time"]
    local_log["execution_time"] = time_spent
    local_log["report_found"] = i
    local_log["report_menu"] = report_menu
    parameters = {}
    if trace_id is not None:
        parameters = {"trace_id": trace_id}
    else:
        parameters = {"start_date": start_date, "end_date": end_date, "location": location, "key_terms": key_terms}

    local_log["query_parameters"] = parameters

    if not reports:
        local_log["status_code"] = 200
        db.child("logs").push(local_log)
        return "found no relevent data", 200

    return_log["execution_time"] = time_spent
    return_log["report_found"] = i
    
    retval["articles"] = reports
    retval["log"] = return_log

    local_log["status_code"] = 200
    db.child("logs").push(local_log)

    return retval, 200
