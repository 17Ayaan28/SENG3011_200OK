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



start_date = "2021-03-17"
end_date = "2021-03-18"

logs = {}

all_data = db.child("logs").get()

for data in all_data.each():
    if data.val() is not None and start_date < data.val()["request_time"] < end_date:
        logs[data.key()] = data.val()
    


print(logs)