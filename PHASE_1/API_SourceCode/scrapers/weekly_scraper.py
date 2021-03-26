# -*- coding: utf-8 -*-
import requests, json
from bs4 import BeautifulSoup
import urllib.parse, re
from collections import deque
import helper
import pyrebase

def noquote(s):
    return s
pyrebase.pyrebase.quote = noquote

f = open("data_db.json", "w", encoding='utf8')

headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "accept-charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
    "accept-encoding": "gzip,deflate,sdch",
    "accept-language": "en-US,en;q=0.8",
}

config = {
  "apiKey": "AIzaSyB2BT5PcLAlDxhVl2E7xcusZQFgOWiaqko",
  "authDomain": "seng3011-306108.firebaseapp.com",
  "databaseURL": "https://seng3011-306108-default-rtdb.firebaseio.com",
  "storageBucket": "seng3011-306108.appspot.com"
}


firebase = pyrebase.initialize_app(config)

db = firebase.database()
test_db = "data_t"

articles = []

start_url = "https://www.cdc.gov/outbreaks/index.html"
base_url = "https://www.cdc.gov/"

raw = requests.get(start_url, headers)
content = BeautifulSoup(raw.content, 'html.parser')

div = content.find('div', text="U.S.-Based Outbreaks")
us_div = div.find_next_sibling('div')

us_a = us_div.find_all('a')
us_links = []

for a in us_a:
    link = a["href"]
    if(not re.compile("^http").search(link)):
        link = urllib.parse.urljoin(base_url, link)
    if(not re.compile('2019-ncov').search(link) and not re.compile('brucellosis').search(link)):
        us_links.append(link)


for link in us_links:
    raw0 = requests.get(link, headers)
    content0 = BeautifulSoup(raw0.content, 'html.parser')

    article = helper.new_article(link)

    syndicates = content0.find_all('div', class_="syndicate")
    # headline
    #if(link == "")
    #print(syndicates)
    #print('--------')
    if(syndicates):
        article["headline"] = syndicates[0].get_text()
    else:
        article["headline"] = helper.get_headline(content0)

    # date_of_publication
    article["date_of_publication"] = helper.get_date_of_publication(content0)

    # main_text
    main_text = ""
    if(syndicates):
        ps = syndicates[1].find_all('p')
        for p in ps:
            main_text = main_text + p.get_text() + "\n"
    article["main_text"] = main_text

    report = helper.new_report()

    # diseases
    report["diseases"] = helper.get_diseases(main_text)

    # syndromes
    report["syndromes"] = helper.get_syndromes(main_text)

    # event_date
    report["event_date"] = helper.get_date(main_text)

    # locations
    locations = helper.get_locations(main_text)
    for lo in locations:
        item = {}
        item["geonames_id"] = lo
        report["locations"].append(item)

    article["reports"].append(report)

    json.dump(article, f, ensure_ascii=False)
    f.write(',\n')

    articles.append(article)

    
div = content.find('div', text="Travel Notices Affecting International Travelers")
travel_div = div.find_next_sibling('div')

travel_as = travel_div.find_all('a')

travel_links = []

for a in travel_as:
    link = a["href"]
    if(link != "http://wwwnc.cdc.gov/travel"):
        travel_links.append(link)

for link in travel_links:
    raw0 = requests.get(link, headers)
    content0 = BeautifulSoup(raw0.content, 'html.parser')

    article = helper.new_article(link)

    # headline
    headline = content0.find('div', class_="pagetitleTP4")
    if(headline):
        article["headline"] = headline.get_text()
    else:
        article["headline"] = helper.get_headline(content0)

    # date of publication
    article["date_of_publication"] = helper.get_date_of_publication(content0)

    # main text
    content_area = content0.find('div', id="contentArea")
    main_text = ""
    if(content_area):
        rows = content_area.find_all('div', class_="row")
        if(rows):
            for row in rows:
                main_text = main_text + row.get_text() + "\n"

    if(not main_text):
        ps = content0.find_all('p')
        for p in ps:
            main_text = main_text + p.text + "\n"

    article["main_text"] = main_text

    report = helper.new_report()
    # diseases
    report["diseases"] = helper.get_diseases(main_text)

    # syndromes
    report["syndromes"] = helper.get_syndromes(main_text) 

    # event date
    report["event_date"] = helper.get_date(main_text)

    # locations
    locations = helper.get_locations(main_text)
    for lo in locations:
        item = {}
        item["geonames_id"] = lo
        report["locations"].append(item)

    article["reports"].append(report)

    json.dump(article, f, ensure_ascii=False)
    f.write(',\n')

    articles.append(article)

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
