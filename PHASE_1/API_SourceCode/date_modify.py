import pyrebase
import json
import re


config = {
  "apiKey": "AIzaSyB2BT5PcLAlDxhVl2E7xcusZQFgOWiaqko",
  "authDomain": "seng3011-306108.firebaseapp.com",
  "databaseURL": "https://seng3011-306108-default-rtdb.firebaseio.com",
  "storageBucket": "seng3011-306108.appspot.com"
}

firebase = pyrebase.initialize_app(config)

db = firebase.database()



all_data = db.child("data_test").get()

for data in all_data.each():
    date = data.val()["date_of_publication"]
    if len(date) < 19:
        date = ' '.join(x.zfill(2) for x in re.split('[- ]', date))
        date = date.replace(' ', '-', 2)
        db.child("data_test").child(data.key()).update({"date_of_publication": date})
