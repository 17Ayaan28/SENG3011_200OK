import pyrebase
import json


config = {
  "apiKey": "AIzaSyB2BT5PcLAlDxhVl2E7xcusZQFgOWiaqko",
  "authDomain": "seng3011-306108.firebaseapp.com",
  "databaseURL": "https://seng3011-306108-default-rtdb.firebaseio.com",
  "storageBucket": "seng3011-306108.appspot.com"
}

firebase = pyrebase.initialize_app(config)

db = firebase.database()

'''
all_data = db.child("dummy").get()

for dummy in all_data.each():
    db.child("dummy").child(dummy.key()).child("article").set(dummy.val()["reports"])
    db.child("dummy").child(dummy.key()).child("reports").remove()
'''


all_data = db.child("data_s").get()
date1 = "2014-12-17 xx-xx-xx"
date2 = "2014-12-01 xx-xx-xx"
date3 = "2020-02-25 xx-xx-xx"

for data in all_data.each():
  if data.val()['url'] == "https://www.cdc.gov/vhf/marburg/outbreaks/summaries.html":
    db.child("data_s").child(data.key()).child("date_of_publication").set(date1)
  elif data.val()['url'] == "https://www.cdc.gov/vhf/marburg/outbreaks/chronology.html":
    db.child("data_s").child(data.key()).child("date_of_publication").set(date2)
  elif data.val()['url'] == "https://www.cdc.gov/vhf/rvf/outbreaks/summaries.html":
    db.child("data_s").child(data.key()).child("date_of_publication").set(date3)

