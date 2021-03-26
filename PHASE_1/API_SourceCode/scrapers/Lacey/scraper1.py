import requests, json
from bs4 import BeautifulSoup
import urllib.parse, re
import sys
sys.path.append("..")
import helper
import time
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

#f = open("/content/drive/MyDrive/Colab Notebooks/lacey_data.json", "w", encoding='utf8')


def not_empty(href):
    return href and not re.compile("^$").search(href)

def scraper(disease, url):
    print("Scraping: " + url)
    f = open("/content/drive/MyDrive/Colab Notebooks/Lacey/" + disease + ".json", "a")

    headers = {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
        "accept-encoding": "gzip,deflate,sdch",
        "accept-language": "en-US,en;q=0.8",
    }

    # stack = deque()
    # stack.append("https://www.cdc.gov/coronavirus/2019-nCoV/index.html")
    # visited = deque()
    # count = 10
    # scraped = 1

    # while len(stack) > 0 and count > 0:
    URL = url
    # visited.append(URL)
    trycount = 3
    while(trycount > 0):
        try:
            raw = requests.get(URL, headers)
            break
        except Exception as e:
            if trycount <= 0: 
                print("Failed to retrieve: " + url + "\n" + str(e))
                continue 
            else: 
                trycount -= 1  # retry
            time.sleep(0.5) 

    soup = BeautifulSoup(raw.content, 'html.parser')
    # print(soup.original_encoding)
    # a = soup.find('div', class_='syndicate')
    # print(a)
    main = soup.find('main')

    article = helper.new_article(URL)
    report = helper.new_report()
    print('-------')
    print(URL)
    article['date_of_publication'], article['headline'] = helper.get_date_headline(soup)
    print(article['date_of_publication'])
    print('----------')
    main_text = []
    syndicates = soup.find_all('div', class_='syndicate')
    if (syndicates):
        for s in syndicates:
            main_text.append(" ")
            main_text.append(s.get_text())

    main_text = " ".join(main_text).strip()

    article['main_text'] = main_text
    # print(main_text)

    report['diseases'] = helper.get_diseases(main_text)
    report['syndromes'] = helper.get_syndromes(main_text)
    article['reports'].append(report)

    # article['main_text'] = helper.get_main_text(main
    # doc = helper.nlp_doc(main_text)
    report['event_date'] = helper.get_date(main_text)

    # report['locations'] = helper.get_locations(doc)
    locations = helper.get_locations(main_text)
    for lo in locations:
        item = {}
        item["geonames_id"] = lo
        report["locations"].append(item)

    if (report['diseases'] and report['event_date'] and report['locations']):
        json.dump(article, f)
        f.write(',\n')
        articles.append(article)

    f.close()
    


for article in articles:
  report = article["reports"][0]
  locations = report["locations"]
  for location in locations:
    geo_id = 
  db.child(test_db).push(article)
"""
#print(len(articles))
"""
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
