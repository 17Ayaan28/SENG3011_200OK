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



f = open('data.json', 'r+')


for data in f.readlines():
    if data[-2] == ',':
        data = data[:-2]
    data = json.loads(data)
    db.child('data_c').push(data)