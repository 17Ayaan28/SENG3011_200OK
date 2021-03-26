import requests, json
from bs4 import BeautifulSoup
import urllib.parse, re
import helper
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

f = open("/content/drive/MyDrive/Colab Notebooks/matt_data.json", "w", encoding='utf8')

headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "accept-charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
    "accept-encoding": "gzip,deflate,sdch",
    "accept-language": "en-US,en;q=0.8",
}

def proper_href(href):
    return re.compile("^/").search(href)

def index_href(href):
    return proper_href(href) and re.compile("index.html$").search(href)

def details_href(href):
    return proper_href(href) and re.compile("details.html$").search(href)

def sars_href(href):
    return not re.compile("mmwr").search(href) and not re.compile("transcripts").search(href) and not re.compile("http").search(href) and not re.compile("civet-ban").search(href)

cdc_base_url = "https://www.cdc.gov/"

salmonellosis_homepage = "https://www.cdc.gov/salmonella/outbreaks.html"

raw = requests.get(salmonellosis_homepage, headers)
content = BeautifulSoup(raw.content, 'html.parser')

# salmonellosis current outbreaks
curr_ul = content.find('ul', id="nav-group-04e9a")
current_outbreak_a = curr_ul.find_all('a', href=index_href)
current_outbreak_links = []
for a in current_outbreak_a:
    #print(urllib.parse.urljoin(cdc_base_url, a["href"]))
    current_outbreak_links.append(urllib.parse.urljoin(cdc_base_url, a["href"]))
#print(current_outbreak_links)

# salmonellosis past outbreaks
past_outbreak_links = []
past_ul = content.find('ul', id="nav-group-0eab5")
past_li = past_ul.find_all('li', class_="list-group-item nav-lvl3")
#print(past_li)
for li in past_li:
    a = li.find('a', href=proper_href)
    past_outbreak_links.append(urllib.parse.urljoin(cdc_base_url, a["href"]))
#print(past_outbreak_links)

# Sars links
sars_homepage = "https://www.cdc.gov/sars/index.html"
raw = requests.get(sars_homepage, headers)
content = BeautifulSoup(raw.content, 'html.parser')

sars_news = content.find('a', text="News and Alerts Archive")
sars_news_link = sars_news["href"]

raw = requests.get(urllib.parse.urljoin(cdc_base_url, sars_news_link), headers)
content = BeautifulSoup(raw.content, 'html.parser')

ul = content.find_all('ul', class_="bullet-list")
sars_outbreak_links = []
for u in ul:
    links = u.find_all('a', href=sars_href)
    for l in links:
        #print(l)
        #l = l["href"]
        #if(sars_href(l)):
        #    print(l)
        if(not re.compile("Travel alert").search(l.text)):  
            sars_outbreak_links.append(urllib.parse.urljoin(cdc_base_url, l["href"]))
        

shigellosis_links = ""

"""
# Salmonellosiss current outbreaks
# salmonelosiss_links = current_outbreak_links + past_outbreak_links
for outbreak_link in current_outbreak_links:
    raw = requests.get(outbreak_link, headers)
    content = BeautifulSoup(raw.content, 'html.parser')

    syndicates = content.find_all('div', class_="syndicate")
    article = helper.new_article(outbreak_link)
    report = helper.new_report()
    #print(outbreak_link)
    #print('-----------')
    h1 = syndicates[0].find('h1')
    if(h1):
      article["headline"] = h1.get_text()
    else:
      article["headline"] = helper.get_headline(content0)
    article["date_of_publication"] = helper.get_date_of_publication(content)

    # main text
    #print(outbreak_link)
    
    investigation_details = content.find('div', string="Investigation Details")
    in_details = ""
    if(investigation_details):
        #print(investigation_details)
        #print('----------')
        investigation_details_link = investigation_details.find_parent('a', href=details_href)
        if(investigation_details_link):
            investigation_details_link = urllib.parse.urljoin(cdc_base_url, investigation_details_link["href"])
            raw0 = requests.get(investigation_details_link, headers)
            content0 = BeautifulSoup(raw0.content, 'html.parser')
            details = content0.find('div', class_="card-body")
            details = details.get_text()
    
    past_details = ""
    past_investigation = content.find('a', string="Previous Updates")
    if(past_investigation):
        past_investigation_link = past_investigation["href"]
        past_investigation_link = urllib.parse.urljoin(cdc_base_url, past_investigation_link)
        raw0 = requests.get(past_investigation_link, headers)
        content0 = BeautifulSoup(raw0.content, 'html.parser')
        past_details = content0.find('div', class_="card-body")
        past_details = past_detials.get_text()


    #nav = content.find('li', class_="list-group-item nav-lvl2 active")
    #investigation_link = nav.find('a', href=proper_href, string="investigation")
    #investigation_link = urllib.parse.urljoin(cdc_base_url, investigation_link["href"])
    #print(investigation_link)
    

    #print(investigation_details_link)
    #print('--------')
    #investigation_details_link = urllib.parse.urljoin(cdc_base_url, investigation_details_link["href"])
    article["main_text"] = syndicates[1].get_text() + in_details + past_details
    #
    
    #raw1 = requests.get(investigation_details_link, headers)
    #content1 = BeautifulSoup(raw1.content, 'html.parser')

    #main_text = content1.find('div', class_="card-body").get_text()
    #article["main_text"] = main_text
    
    report["diseases"] = helper.get_diseases(article["main_text"])
    if("salmonellosis" not in report['diseases']):
        report["diseases"].append("salmonellosis")
    report["syndromes"] = helper.get_syndromes(article["main_text"])
    report["event_date"] = helper.get_date(article["main_text"])

    # get locations
    #box = content.find('div', class_="card-body bg-tertiary")
    #print(outbreak_link)
    #print(box)
    states = content.find('a', text=re.compile("^States(:?)$"))
    #print(states)
    #print('--------------')
    state_link = urllib.parse.urljoin(cdc_base_url, states["href"])

    raw2 = requests.get(state_link, headers)
    content2 = BeautifulSoup(raw2.content, 'html.parser')

    locations = helper.get_locations(content2.get_text())
    for lo in locations:
        item = {}
        item["geonames_id"] = lo
        report["locations"].append(item)
    
    article["reports"].append(report)
    articles.append(article)
    json.dump(article, f, ensure_ascii=False)
    f.write(',\n')
"""

# Salmonellosis past outbreaks

for past_outbreak in past_outbreak_links:
    print(past_outbreak)

    raw0 = requests.get(past_outbreak, headers)
    content0 = BeautifulSoup(raw0.content, 'html.parser')

    syndicates0 = content0.find_all('div', class_="syndicate")

    article = helper.new_article(past_outbreak)

    # headline
    h1 = syndicates0[0].find('h1')
    if(h1):
      article["headline"] = h1.get_text()
    else:
      article["headline"] = helper.get_headline(content0)

    # date_of_publication
    article["date_of_publication"] = helper.get_date_of_publication(content0)

    # main_text
    past_details = ""
    past_investigation = content0.find('a', string="Previous Updates")
    if(past_investigation):
        past_investigation_link = past_investigation["href"]
        past_investigation_link = urllib.parse.urljoin(cdc_base_url, past_investigation_link)
        raw00 = requests.get(past_investigation_link, headers)
        content00 = BeautifulSoup(raw00.content, 'html.parser')
        past_details = content00.find('div', class_="card-body")
        past_details = past_detials.get_text()
    print('--------')
    p_tags = 
    #print(past_details)
    article["main_text"] = ""
    if(len(syndicates0) == 1):
      print('haha')
      article["main_text"] = syndicates0[0].get_text() + past_details
    else:
      print('fkkkk')
      article["main_text"] = syndicates0[1].get_text() + past_details
      print(syndicates0[1])
    print(article["main_text"])
    print('--------')
    report = helper.new_report()

    # diseases
    report["diseases"] = helper.get_diseases(article["main_text"])
    if("salmonellosis" not in report['diseases']):
        report["diseases"].append("salmonellosis")
    
    # syndromes
    report["syndromes"] = helper.get_syndromes(article["main_text"])
    # event_date
    report["event_date"] = helper.get_date(article["main_text"])
    # locations
    locations = helper.get_locations(article["main_text"])
    for lo in locations:
        item = {}
        item["geonames_id"] = lo
        report["locations"].append(item)

    article["reports"].append(report)  
    articles.append(article) 
    json.dump(article, f, ensure_ascii=False)
    f.write(',\n') 


# sars
for sars_link in sars_outbreak_links:

    raw = requests.get(sars_link, headers)
    content = BeautifulSoup(raw.content, 'html.parser')

    if(re.compile("media/pressrel").search(sars_link)):
        #body = content.find('tr')
        article = helper.new_article(sars_link)
        h3 = content.find('h3')
        #print(h3)
        article["headline"] = h3.get_text()
        #print(h3.find_previous_sibling())
        article["date_of_publication"] = helper.get_date(h3.find_previous_sibling().get_text())
        #print(article["headline"])
        #print(article["date_of_publication"])
        #article["main_text"] = h3.find_s
        #print('---------')
        # main text 
        main_text = ""
        tags = h3.find_next_siblings('p', align=False)
        for t in tags:
            main_text = main_text + t.get_text() + "\n"
        #print(main_text)
        article["main_text"] = main_text
        
        report = helper.new_report()
        #report["diseases"] = ["sars"]
        report["diseases"] = helper.get_diseases(main_text)
        if("sars" not in report['diseases']):
            report["diseases"].append("sars")
        report["syndromes"] = helper.get_syndromes(main_text)
        report["event_date"] = helper.get_date(main_text)
        locations = helper.get_locations(main_text)
        for lo in locations:
            item = {}
            item["geonames_id"] = lo
            report["locations"].append(item)

        article["reports"].append(report)
        articles.append(article)
        json.dump(article, f, ensure_ascii=False)
        f.write(',\n')
    else:
        syndicates = content.find_all('div', class_="syndicate")

        article = helper.new_article(sars_link)
        article["date_of_publication"] = helper.get_date_of_publication(content)
        h1 = syndicates[0].find('h1').get_text()
        article["headline"] = h1
        # main_text
        #print(sars_link)
        main_text = ""
        p_tags = syndicates[1].find_all('p')
        for p in p_tags:
            if(not re.compile("Printer friendly version").search(p.text)):
                main_text = main_text + p.text + '\n'
        article["main_text"] = main_text
        #print(main_text)
        report = helper.new_report()
        # diseases
        report["diseases"] = helper.get_diseases(main_text)
        if("sars" not in report['diseases']):
            report["diseases"].append("sars")
        # syndromes
        report["syndromes"] = helper.get_syndromes(main_text)
        # event_date
        report["event_date"] = helper.get_date(main_text)

        #locations
        locations = helper.get_locations(main_text)
        for lo in locations:
            item = {}
            item["geonames_id"] = lo
            report["locations"].append(item)

        article["reports"].append(report)
        articles.append(article)
        json.dump(article, f, ensure_ascii=False)
        f.write(',\n')
        #print('------------')

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
