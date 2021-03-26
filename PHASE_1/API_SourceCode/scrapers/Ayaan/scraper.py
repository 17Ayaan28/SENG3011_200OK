## Libraries required for web scraping
from bs4 import BeautifulSoup 
import requests, json
import sys
sys.path.append("..")
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

f = open("/content/drive/MyDrive/Colab Notebooks/Ayaan/data.json", "w", encoding='utf8')


## Scraping Reports for Cutaneous and Inhalation Anthrax
print(">>>> Cutaneous and Inhalationo Anthrax")
base_url = "https://www.cdc.gov"

anthrax_url = "https://www.cdc.gov/anthrax/resources/index.html"

anthrax_page = requests.get(anthrax_url)

soup = BeautifulSoup(anthrax_page.text, 'html.parser')

links_list = soup.find('hr').next_sibling.next_sibling

url_list = links_list.find_all('a')

for url in url_list:
    next_url = base_url + url.get('href')

    next_page = requests.get(next_url)

    soup = BeautifulSoup(next_page.text, 'html.parser')

    article = helper.new_article(next_url)
    report = helper.new_report()

    article['date_of_publication'], article['headline'] = helper.get_date_headline(soup)

    main_text = []
    syndicates = soup.find_all('div', class_='syndicate')

    if (syndicates):
        for s in syndicates:
            result = s.get_text().replace('\n','')

            main_text.append(result)

    main_text = "\n".join(main_text).strip()

    article['main_text'] = main_text

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
    
    report["diseases"].append('anthrax')
    
    if (report['diseases'] and report['event_date'] and report['locations']):
        json.dump(article, f)
        articles.append(article)
        f.write(',\n')

	# print(article)


#Scraping reports for botulism
print (">>>> botulism")
botulism = "https://www.cdc.gov/botulism/resources.html"

botulism_page = requests.get(botulism)

soup = BeautifulSoup(botulism_page.text, 'html.parser')

links_list = soup.find('ul', id='nav-group-43e63')

for url in links_list.find_all('a'):
    next_url = base_url + url.get('href')

    next_page = requests.get(next_url)

    soup = BeautifulSoup(next_page.text, 'html.parser')

    article = helper.new_article(next_url)
    report = helper.new_report()

    article['date_of_publication'], article['headline'] = helper.get_date_headline(soup)

    main_text = []
    syndicates = soup.find_all('div', class_='syndicate')

    if (syndicates):
        for s in syndicates:
            main_text.append(s.get_text().replace('\n',''))

    main_text = "\n".join(main_text).strip()

    article['main_text'] = main_text

    report['diseases'] = helper.get_diseases(main_text)
    report['syndromes'] = helper.get_syndromes(main_text)
    article['reports'].append(report)
    json.dump(article, f)
    articles.append(article)
    f.write(',\n')

# Scraping reports for chikungunya
print(">>>> chikungunya")
chikungunya_url = "https://www.cdc.gov/chikungunya/geo/index.html"

chikungunya_page = requests.get(chikungunya_url)

soup = BeautifulSoup(chikungunya_page.text, 'html.parser')

url_list = soup.find('ul', id='nav-group-f9284')

for url in url_list.find_all('a'):
	
    next_url = base_url + url.get('href')

    next_page = requests.get(next_url)

    soup = BeautifulSoup(next_page.text, 'html.parser')

    article = helper.new_article(next_url)
    report = helper.new_report()

    article['date_of_publication'], article['headline'] = helper.get_date_headline(soup)

    main_text = []
    syndicates = soup.find_all('div', class_='syndicate')

    if (syndicates):
        for s in syndicates:
            main_text.append(s.get_text().replace('\n',''))

    main_text = "\n".join(main_text).strip()

    article['main_text'] = main_text

    report['diseases'] = helper.get_diseases(main_text)
    report['syndromes'] = helper.get_syndromes(main_text)
    article['reports'].append(report)

    json.dump(article, f)
    articles.append(article)
    f.write(',\n')

## Dengue Scraping
print(">>>> Dengue")
dengue_url = "https://www.cdc.gov/dengue/statistics-maps/2021.html"

dengue_page = requests.get(dengue_url)

soup = BeautifulSoup(dengue_page.text, 'html.parser')

list_of_all_links = soup.find('ul', id="nav-group-a4e5a")


for url in list_of_all_links.find_all('a'):

    next_url = base_url + url.get('href')

    next_page = requests.get(next_url)

    soup = BeautifulSoup(next_page.text, 'html.parser')

    article = helper.new_article(next_url)
    report = helper.new_report()


    article['date_of_publication'], article['headline'] = helper.get_date_headline(soup)

    main_text = []
    syndicates = soup.find_all('div', class_='syndicate')

    if (syndicates):
        for s in syndicates:
            main_text.append(s.get_text().replace('\n',''))

    main_text = "\n".join(main_text).strip()

    article['main_text'] = main_text

    report['diseases'] = helper.get_diseases(main_text)
    report['syndromes'] = helper.get_syndromes(main_text)
    article['reports'].append(report)

    json.dump(article, f)
    articles.append(article)
    f.write(',\n')


## Ebola Scraping
print(">>>> Ebola")
ebola_url = "https://www.cdc.gov/vhf/ebola/outbreaks/index-2018.html"

ebola_page = requests.get(ebola_url)

soup = BeautifulSoup(ebola_page.text, 'html.parser')

list_of_all_links = soup.find('ul', id="nav-group-654a4")

pattern = "january|february|march|april|may|june|july|august|september|ectober|december"


for url in list_of_all_links.find_all('a'):

    result = re.search(pattern, url.get('href'))

    if (result):
        next_url = base_url + url.get('href')

        next_page = requests.get(next_url)

        soup = BeautifulSoup(next_page.text, 'html.parser')

        article = helper.new_article(next_url)
        report = helper.new_report()


    article['date_of_publication'], article['headline'] = helper.get_date_headline(soup)
    main_text = []
    syndicates = soup.find_all('div', class_='syndicate')
    
    if (syndicates):
		    for s in syndicates:
		    	  main_text.append(s.get_text().replace('\n',''))

    main_text = "\n".join(main_text).strip()

    article['main_text'] = main_text

    report['diseases'] = helper.get_diseases(main_text)
    report['diseases'].append("ebola haemorrhagic fever")
    report['syndromes'] = helper.get_syndromes(main_text)
    article['reports'].append(report)
    json.dump(article, f)
    articles.append(article)
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
