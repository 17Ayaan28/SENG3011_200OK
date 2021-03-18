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


all_data = db.child("data").get()
syndromes = ["Fever of unknown Origin"]
for data in all_data.each():
    db.child("data").child(data.key()).child("reports").child(0).child("syndromes").set(syndromes)