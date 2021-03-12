import pyrebase
import requests
import json

config = {
  "apiKey": "AIzaSyB2BT5PcLAlDxhVl2E7xcusZQFgOWiaqko",
  "authDomain": "seng3011-306108.firebaseapp.com",
  "databaseURL": "https://seng3011-306108-default-rtdb.firebaseio.com",
  "storageBucket": "seng3011-306108.appspot.com"
}

firebase = pyrebase.initialize_app(config)

db = firebase.database()

data = {
    "url":"https://www.who.int/csr/don/17-january-2020-novel-coronavirus-japan-ex-china/en/",
    "date_of_publication":"2020-01-17 xx:xx:xx",
    "headline":"Novel Coronavirus \u2013 Japan (ex-China)",
    "main_text":"On 15 January 2020, the Ministry of Health, Labour and Welfare, Japan (MHLW) reported an imported case of laboratory-confirmed 2019-novel coronavirus (2019-nCoV) from Wuhan, Hubei Province, China. The case-patient is male, between the age of 30-39 years, living in Japan. The case-patient travelled to Wuhan, China in late December and developed fever on 3 January 2020 while staying in Wuhan. He did not visit the Huanan Seafood Wholesale Market or any other live animal markets in Wuhan. He has indicated that he was in close contact with a person with pneumonia. On 6 January, he traveled back to Japan and tested negative for influenza when he visited a local clinic on the same day.",
    "reports":
    [
        {	
            "diseases":["2019-nCoV"],
            "event_date":"2020-01-03 xx:xx:xx to 2020-01-15",
            "locations":
            [
                {"country":"China", "location": "Wuhan, Hubei Province"},
                {"country":"Japan", "location": ""}
            ],
            "syndromes":["Fever of unknown Origin"]
        }
    ]
}

jdata = json.dumps(data)
#print(jdata)

#remove
#db.child("Novel Coronavirus").child("China").remove(data)

#push
db.child("Novel Coronavirus").child("China").set(data)

#update
db.child("Novel Coronavirus").child("China").update(data)

#retrieve
rdata = db.child("Novel Coronavirus").child("China").get()
print(rdata.val())

all_data = db.child("Novel Coronavirus").child("China").get()
for data in all_data.each():
    print(data.key())
    print(data.val())

#data_by_date = db.child("Novel Coronavirus").child("China").order_by_child("date_of_publication").equal_to("2020-01-17 xx:xx:xx").get()
#print(data_by_date)