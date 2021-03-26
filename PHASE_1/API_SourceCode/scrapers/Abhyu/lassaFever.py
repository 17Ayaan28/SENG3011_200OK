from bs4 import BeautifulSoup 
import requests, json
import sys
sys.path.append("..")
import helper, time
import re, urllib.parse
import pyrebase

def noquote(s):
    return s
pyrebase.pyrebase.quote = noquote

config = {
  "apiKey": "AIzaSyB2BT5PcLAlDxhVl2E7xcusZQFgOWiaqko",
  "authDomain": "seng3011-306108.firebaseapp.com",
  "databaseURL": "https://seng3011-306108-default-rtdb.firebaseio.com",
  "storageBucket": "seng3011-306108.appspot.com"
}

firebase = pyrebase.initialize_app(config)

db = firebase.database()
test_db = "data_test"

articles = []

f = open("/content/drive/MyDrive/Colab Notebooks/Abhyu/lassaFever.json", "w", encoding='utf8')

base_url = "https://www.cdc.gov"
lassa_url = "https://www.cdc.gov/vhf/lassa/index.html"

lassa_page = requests.get(lassa_url)

soup = BeautifulSoup(lassa_page.text, 'html.parser')

lassa_list = []
lassa_list.append(lassa_url)
lassa_list.append("https://www.cdc.gov/vhf/lassa/outbreaks/index.html")

for new_url in lassa_list:

    next_url = requests.get(new_url)

    soup = BeautifulSoup(next_url.text, 'html.parser')


    article = helper.new_article(new_url)
    report = helper.new_report()

    article['date_of_publication'], article['headline'] = helper.get_date_headline(soup)

    main_text = []
    syndicates = soup.find_all('div', class_='syndicate')

    if (syndicates):
        for s in syndicates:
            main_text.append(" ")
            main_text.append(s.get_text())

    main_text = "\n".join(main_text).strip()

    article['main_text'] = main_text

    report['diseases'] = helper.get_diseases(main_text)
    report['syndromes'] = helper.get_syndromes(main_text)
    report['event_date'] = helper.get_date(main_text)

    locations = helper.get_locations(main_text)
    for lo in locations:
        item = {}
        item["geonames_id"] = lo
        report["locations"].append(item)
    article['reports'].append(report)
    articles.append(article)
    json.dump(article, f, ensure_ascii=False)
    f.write(',\n')

f.close()

for article in articles:

  report = article["reports"][0]
  locations_objs = report["locations"]
  locations_ids = []
  parents_ids = []
  for obj in locations_objs:
    locations_ids.append(obj["geonames_id"])
  for lo_id in locations_ids:
    parents = geocoder.geonames(lo_id, key="jiahui", method="hierarchy")
    ids = []
    for p in parents:
      ids.append(p.geonames_id)
    db.child('hierarchy_test').child(lo_id).set(ids)


  urls = 0
  e = db.child(test_db).order_by_child("url").equal_to(article["url"]).get()
  for ee in e.each():
    urls += 1
    if(ee.val()["main_text"] != article["main_text"]):
      db.child(test_db).push(article)
  if(urls == 0):
    db.child(test_db).push(article)

