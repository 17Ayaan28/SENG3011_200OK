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

data1 = {
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


data2 = {
    "url":"https://www.who.int/csr/don/17-january-2020-novel-coronavirus-japan-ex-china/en/",
    "date_of_publication":"2021-01-17 xx:xx:xx",
    "headline":"Novel Coronavirus \u2013 Japan (ex-China)",
    "main_text":"On 15 January 2020, the Monistry of Health, Labour and Welfare, Japan (MHLW) reported an imported case of laboratory-confirmed 2019-novel coronavirus (2019-nCoV) from Wuhan, Hubei Province, China. The case-patient is male, between the age of 30-39 years, living in Japan. The case-patient travelled to Wuhan, China in late December and developed fever on 3 January 2020 while staying in Wuhan. He did not visit the Huanan Seafood Wholesale Market or any other live animal markets in Wuhan. He has indicated that he was in close contact with a person with pneumonia. On 6 January, he traveled back to Japan and tested negative for influenza when he visited a local clinic on the same day.",
    "reports":
    [
        {	
            "diseases":["2019-nCoV"],
            "event_date":"2020-01-03 xx:xx:xx to 2020-01-15",
            "locations":
            [
                {"country":"Korean", "location": "Wuhan, Hubei Province"},
                {"country":"Japan", "location": ""}
            ],
            "syndromes":["Fever of unknown Origin"]
        }
    ]
}

retval = {}

#jdata = json.dumps(data)
#print(jdata)

#remove
#db.child("Novel Coronavirus").child("China").remove(data)

#push
#db.child("report").child("1").set(data1)
#db.child("report").child("2").set(data2)

#update
#db.child("covid").update(data)

#retrieve
#rdata = db.child("covid").child("china").get()
#print(rdata.val())

#rdata2 = db.child("covid").child("china").child("url").get()
#print(rdata2.key())
#print(rdata2.val())

'''
all_data = db.child("covid").child("china").get()
for data in all_data.each():
    print(data.key())
    print(data.val())
    print("\n")
'''

#data_by_date = db.child("Novel Coronavirus").child("China").order_by_child("date_of_publication").equal_to("2020-01-17 xx:xx:xx").get()
#print(data_by_date)


#retrieve by search keyterms
'''
key_terms = "ministry,nCoV,Zika"
key_terms = key_terms.split(",")


all_data = db.child("report")

for data in all_data.get().each():
    for term in key_terms:
        if data.val() is not None and term.lower() in data.val()["main_text"].lower():
            print(data.val())
            break
'''

#retrieve by search date
start_date = "2021-01-10"
end_date = "2021-01-20"

'''
all_data = db.child("report")

for data in all_data.get().each():
    if data.val() is not None and end_date > data.val()["date_of_publication"] > start_date:
        print(data.val())
'''


#retrieve by search location
location = "china"

'''
all_data = db.child("report")

for data in all_data.get().each():
    if data.val() is not None:
        for report in data.val()["reports"]:
            for locset in report["locations"]:
                if location.lower() in locset["country"].lower() or location.lower() in locset["location"].lower():
                    print(data.val())
'''

#query test

key_terms = "health,Zika"
key_terms = key_terms.split(",")
location = "japan"
start_date = "2020-01-10"
end_date = "2021-01-20"

all_data = db.child("report").get()
i = 0
for data in all_data.each():
    if data.val() is not None:
        if end_date > data.val()["date_of_publication"] > start_date:
            t = False
            for report in data.val()["reports"]:
                for locset in report["locations"]:
                    if location.lower() in locset["country"].lower() or location.lower() in locset["location"].lower():
                        if len(key_terms) == 0:
                            retval[i] = data.val()
                            i = i + 1
                        else:
                            for term in key_terms:
                                if term.lower() in data.val()["main_text"].lower():
                                    retval[i] = data.val()
                                    i = i + 1
                                    break
                        t = True
                        break
                if t:
                    break


if not retval:
    print("No relevent data")
else:
    print(retval)
