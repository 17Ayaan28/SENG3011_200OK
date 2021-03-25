import pyrebase
import geocoder
import json
import time

request_time = time.time()

config = {
  "apiKey": "AIzaSyB2BT5PcLAlDxhVl2E7xcusZQFgOWiaqko",
  "authDomain": "seng3011-306108.firebaseapp.com",
  "databaseURL": "https://seng3011-306108-default-rtdb.firebaseio.com",
  "storageBucket": "seng3011-306108.appspot.com"
}

firebase = pyrebase.initialize_app(config)

db = firebase.database()
uname = 'matthewxoy'


all_data = db.child("data_test").get()



def insert(id):
    if not db.child("hierarchy").get().val().__contains__(str(id)):
        h = geocoder.geonames(id, method = 'hierarchy', key = uname)
        h_ids = []
        for addr in h:
            h_ids.append(addr.geonames_id)
            db.child("hierarchy").child(id).set(h_ids)



for data in all_data.each():
    if data.val().__contains__("reports"):
        for report in data.val()["reports"]:
            if report.__contains__("locations"):
                for geo_id in report["locations"]:
                    insert(geo_id["geonames_id"])
                    

response_time = time.time()
time_spent = response_time - request_time
print("Excution time:", time_spent)