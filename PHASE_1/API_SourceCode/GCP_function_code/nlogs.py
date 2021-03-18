import pyrebase
import requests

def logs(request):
    
    config = {
    "apiKey": "AIzaSyB2BT5PcLAlDxhVl2E7xcusZQFgOWiaqko",
    "authDomain": "seng3011-306108.firebaseapp.com",
    "databaseURL": "https://seng3011-306108-default-rtdb.firebaseio.com",
    "storageBucket": "seng3011-306108.appspot.com"
    }

    limit = request.args.get("limit")

    if limit is None:
        limit = 10
    else:
        limit = int(limit)

    firebase = pyrebase.initialize_app(config)

    db = firebase.database()


    all_log = db.child("logs").get()
    logs = []

    for log in sorted(all_log.val(), reverse=True):
        logs.append(db.child("logs").child(log).get().val())
        limit = limit - 1
        if limit == 0:
            break


    return {"logs": logs}