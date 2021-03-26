## Libraries required for web scraping
from bs4 import BeautifulSoup 
import requests, json
import helper
import re
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


f = open("/content/drive/MyDrive/Colab Notebooks/Abhyu/hiv.json", "w", encoding='utf8')

base_url = "https://www.cdc.gov"

hiv_url = "https://www.cdc.gov/hiv/basics/statistics.html"
hiv_page = requests.get(hiv_url)

soup = BeautifulSoup(hiv_page.text, 'html.parser')

#url_linked_list = soup.find('ul', id='nav-group-d3177')
#url_list = url_linked_list.find_all('a')
url_list = []
url_list.append(hiv_url)

"""
Need to enable javascript to view content- Selelium library
url_list.append("https://www.cdc.gov/hiv/basics/covid-19.html#")
"""

for url in url_list:

    if (str(url).startswith(base_url)):
        next_url = url
    else:
        next_url = base_url + url.get('href')

    next_page = requests.get(next_url)

    soup = BeautifulSoup(next_page.text, 'html.parser')

    article = helper.new_article(next_url)
    report = helper.new_report()

    article['date_of_publication'], article['headline'] = helper.get_date_headline(soup)

    main_text = []
    syndicates = soup.find_all('div', class_='syndicate')

 
    if (syndicates):
        main_text=[]
        for s in syndicates:
            main_text.append(" ")
            main_text.append(s.get_text().replace('\n', ' '))

    if not(syndicates):
        for para in soup.find_all('p'):
            para=str(para).replace('<p>', ' ')
            para=str(para).replace('</p>', ' ')
            para=str(para).replace('\n', ' ')
            main_text.append(para)
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
    f.write('\n')

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

