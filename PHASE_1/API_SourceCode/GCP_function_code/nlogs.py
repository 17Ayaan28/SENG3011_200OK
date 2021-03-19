import pyrebase
import requests

def logs(request):

    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    
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