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

f = open("/content/drive/MyDrive/Colab Notebooks/ellen_data.json", "w", encoding='utf8')

headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "accept-charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
    "accept-encoding": "gzip,deflate,sdch",
    "accept-language": "en-US,en;q=0.8",
}


def not_empty(href):
    return href and not re.compile("^$").search(href)

def contain_url(content):
    return re.compile("url=").search(content)

def jprint(obj):
    # create a formatted string of the Python JSON object
    text = json.dumps(obj, sort_keys=True, indent=4)
    print(text)

az_list = helper.get_az_list()

outbreak_url = "https://www.cdc.gov/outbreaks/"

disease_names_list = []

for d in helper.disease_list:
    disease_names_list.append(d['name'])


raw = requests.get(outbreak_url, headers)
soup = BeautifulSoup(raw.content, 'html.parser')
"""
az_index = soup.find('a', id="az-large")
az_index = az_index['href']

temp = requests.get(az_index, headers)
temp = BeautifulSoup(temp.content, 'html.parser')
az_real_url = temp.find('meta', content=contain_url)
az_real_url = az_real_url['content']
az_real_url = az_real_url[az_real_url.find("/az/"):]
az_real_url = urllib.parse.urljoin(outbreak_url, az_real_url)
#print(az_real_url)

az_raw = requests.get(az_real_url, headers)
az_content = BeautifulSoup(az_raw.content, 'html.parser')
az = az_content.find('div', class_="az-strip")
az = az.find_all('a')
for url in az:
    url = url['href']
    url = urllib.parse.urljoin(outbreak_url, url)
    az_urls.append(url)
    print(url)
"""
az_urls = []
for character in az_list:
    url = "/az/" + character + ".html"
    url = urllib.parse.urljoin(outbreak_url, url)
    az_urls.append(url)
    #print(url)

diseases_links = []
for url in az_urls:

    raw = requests.get(url, headers)
    content = BeautifulSoup(raw.content, 'html.parser')

    ul = content.find('ul', class_="unstyled-list pl-0")
    disease_urls = ul.find_all('a')

    for disease in disease_urls:
        disease_name = disease.get_text().lower()
        #print('----------')
        #print(disease_name)
        #print("malaria"[:-1])
        index1 = disease_name.find(" — ")
        index2 = disease_name.find(" (")
        index3 = disease_name.find(" [")
        #print(index1)
        #print(index2)
        disease_name = disease_name[:disease_name.find(" — ")] if index1 != -1 else disease_name
        disease_name = disease_name[:disease_name.find(" (")] if index2 != -1 else disease_name
        disease_name = disease_name[:disease_name.find(" [")] if index3 != -1 else disease_name
        #print(disease_name)
        #print('----------')
        if(disease_name in disease_names_list):
            item = {}
            item["name"] = disease_name
            item["link"] = disease["href"]
            if('vaccine' not in disease["href"]):
                diseases_links.append(item)
                #json.dump(item, f)
                #f.write('\n')
links = []
for disease_item in diseases_links:

    raw = requests.get(disease_item["link"], headers)
    content = BeautifulSoup(raw.content, 'html.parser')

    link = content.find_all('a', string=["Outbreaks", "MERS in the U.S."])

    if(link and disease_item["name"] != "pertussis"):
        #print('------------')
        #print(disease_item["name"])
        #print(link)
        #print('------------')

        link = link[0]["href"]

        link = urllib.parse.urljoin(outbreak_url, link)

        item = {}
        item["name"] = disease_item["name"]
        item["link"] = link

        links.append(item)

#print(links)

for link_item in links:

    name = link_item["name"]
    link = link_item["link"]

    raw = requests.get(link, headers)
    content = BeautifulSoup(raw.content, 'html.parser')
    
    if("marburg" in name):

        syndicate = content.find('div', class_="syndicate")
        link_list = syndicate.find_all('a')

        link_item["link"] = [urllib.parse.urljoin(outbreak_url, link_list[0]["href"]), urllib.parse.urljoin(outbreak_url, link_list[1]["href"])]
    
    elif("mers" in name):
         
        ul = content.find('ul', class_="block-list")
        link_list = ul.find_all('a')
        link_item["link"] = [urllib.parse.urljoin(outbreak_url, link_list[1]["href"]), urllib.parse.urljoin(outbreak_url, link_list[2]["href"]), 
                            urllib.parse.urljoin(outbreak_url, link_list[4]["href"])]

    else:

        syndicate = content.find('div', class_="syndicate")
        link_list = syndicate.find_all('a')
        link_item["link"] = [urllib.parse.urljoin(outbreak_url, link_list[0]["href"])]

print(links)


for link_item in links:

    name = link_item["name"]
    link_array = link_item["link"]

    if("marburg" in name):
        
        # link 1 - Marburg Outbreaks 2005-2014
        raw = requests.get(link_array[0], headers)
        content = BeautifulSoup(raw.content, 'html.parser')

        h2_tags = content.find_all('h2')

        for h2 in h2_tags:
            #print('----------')
            #print(h2)
            p_tag = h2.find_next_sibling('p').get_text()

            #print(p_tag)
            

            article = helper.new_article(link_array[0])
            article["headline"] = h2.get_text()
            article["date_of_publication"] = helper.get_date_of_publication(content)
            article["main_text"] = p_tag

            report = helper.new_report()
            report["diseases"] = helper.get_diseases(p_tag)
            if(helper.get_disease_json_name(name) not in report['diseases']):
              report["diseases"].append(helper.get_disease_json_name(name))
            report["syndromes"] = helper.get_syndromes(p_tag)
            # event_date
            report["event_date"] = helper.get_event_date(p_tag)
            # location use NLP
            #header = h2.get_text()
            #index = header.find("in ")
            #location = header[index + 3:] if index != -1 else header[header.find(" – ") + 3:]
            #report["locations"] = []
            locations = helper.get_locations(p_tag)
            for l in locations:
                item = {}
                item["geonames_id"] = l
                locations.append(item)
            report["locations"] = locations
            #print(helper.get_event_date(p_tag))
            #print(locations)
            #print('-----------')
            article["reports"].append(report)
            articles.append(article)
            json.dump(article, f, ensure_ascii=False)
            f.write(',\n')
        
        # link 2 - Outbreaks Chronology: Marburg Hemorrhagic Fever
        raw = requests.get(link_array[1], headers)
        content = BeautifulSoup(raw.content, 'html.parser')


        table = content.find('tbody')

        trs = table.find_all('tr')

        for tr in trs:

            article = helper.new_article(link_array[1])
            article["headline"] = "Known Cases and Outbreaks of Marburg Hemorrhagic Fever"
            article["date_of_publication"] = helper.get_date_of_publication(content)
            report = helper.new_report()

            #report["diseases"] = [helper.get_disease_json_name(name)]
            report["diseases"] = helper.get_diseases(p_tag)
            if(helper.get_disease_json_name(name) not in report['diseases']):
              report["diseases"].append(helper.get_disease_json_name(name))
            # year
            year = tr.find('th').get_text()
            year = year + "-xx-xx xx:xx:xx"

            report["event_date"] = year

            # locations 
            tds = tr.find_all('td')

            locations = []

            for lo in tds[:2]:
                #locatons.append(lo.get_text)
                lo = helper.get_locations(lo.get_text())

                for l in lo:

                    item = {}
                    item["geonames_id"] = l
                    locations.append(item)
            report["locations"] = locations
                
            # main_text
            main_text = tds[4].get_text()
            article["main_text"] = main_text

            report["syndromes"] = helper.get_syndromes(main_text)

            article["reports"].append(report)
            articles.append(article)
            json.dump(article, f, ensure_ascii=False)
            f.write(',\n')


    elif("mers" in name):
        print("mers")
        for link in link_array:
            raw = requests.get(link, headers)
            content = BeautifulSoup(raw.content, 'html.parser')

            syndicates = content.find_all('div', class_="syndicate")

            article = helper.new_article(link)

            # headline
            headline = syndicates[0].get_text()
            article["headline"] = headline

            # date of publication
            #date_of_publication = syndicates[1].find('div', class_="card-body bg-gray-l3")
            #date_of_publication = date_of_publication.find('p').text
            #date_of_publication = helper.get_date(date_of_publication)
            #print(date_of_publication)
            article["date_of_publication"] = helper.get_date_of_publication(content)

            # main_text
            div = syndicates[1].find('div', class_="card mb-3")
            main_text = div.find_next_siblings('p')
            
            real_main = []
            for p in main_text:
                if("For more information" not in p.get_text()):
                    real_main.append(p.get_text())
                else:
                    break
            
            main_text = '\n'.join(real_main)

            article["main_text"] = main_text

            report = helper.new_report()
            report["diseases"] = helper.get_diseases(main_text)
            if(name not in report['diseases']):
              report["diseases"].append(name)
            report["syndromes"] = helper.get_syndromes(main_text)
            #print(main_text)
            # event date
            event_date = helper.get_date(main_text)
            report["event_date"] = event_date
            # locations
            locations = []
            locations_list = helper.get_locations(main_text)
            for l in locations_list:
                item = {}
                item["geonames_id"] = l
                locations.append(item)
            report["locations"] = locations
            article["reports"].append(report)
            articles.append(article)
            json.dump(article, f, ensure_ascii=False)
            f.write(',\n')
    
    else:
        print("rift")
        raw = requests.get(link_array[0], headers)
        content = BeautifulSoup(raw.content, 'html.parser')

        h2_tags = content.find_all('h2')

        for h2 in h2_tags:
            #print('----------')
            #print(h2)
            p_tag = h2.find_next_sibling('p').get_text()

            article = helper.new_article(link_array[0])
            
            # headline
            headline = "Rift Valley Fever Outbreaks: " + h2.get_text()
            article["headline"] = headline
            
            # main_text
            article["main_text"] = p_tag

            article["date_of_publication"] = helper.get_date_of_publication(content)

            # Report
            report = helper.new_report()

            # diseases
            report["diseases"] = helper.get_diseases(p_tag)

            # syndromes
            report["syndromes"] = helper.get_syndromes(p_tag)

            # event_date
            report["event_date"] = helper.get_date(p_tag)

            # locations
            locations = []
            locations_list = helper.get_locations(main_text)
            for l in locations_list:
                item = {}
                item["geonames_id"] = l
                locations.append(item)
            report["locations"] = locations
        
            article["reports"].append(report)
            articles.append(article)
            json.dump(article, f, ensure_ascii=False)
            f.write(',\n')

f.close()
"""
for article in articles:
  report = article["reports"][0]
  locations = report["locations"]
  for location in locations:
    geo_id = 
  db.child(test_db).push(article)
"""
#print(len(articles))

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
 
