import requests, json
from bs4 import BeautifulSoup
import urllib.parse, re
import sys
sys.path.append("..")
import helper

f = open("matt.json", "w", encoding='utf8')

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
print(">>>> salmonellosis")

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
    article["headline"] = syndicates[0].get_text()
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
    
    report["diseases"] = ["salmonellosis"]
    report["syndromes"] = helper.get_syndromes(article["main_text"])
    report["event_date"] = helper.get_date(article["main_text"])

    # get locations
    #box = content.find('div', class_="card-body bg-tertiary")
    #print(outbreak_link)
    #print(box)
    states = content.find('a', text=re.compile("^States(:?)$"))
    print(states)
    print('--------------')
    state_link = urllib.parse.urljoin(cdc_base_url, states["href"])

    raw2 = requests.get(state_link, headers)
    content2 = BeautifulSoup(raw2.content, 'html.parser')

    locations = helper.get_locations(content2.get_text())
    for lo in locations:
            item = {}
            item["geonames_id"] = lo
            report["locations"].append(item)
    
    article["reports"].append(report)

    json.dump(article, f, ensure_ascii=False)
    f.write(',\n')



# Salmonellosis past outbreaks

for past_outbreak in past_outbreak_links:
    print(past_outbreak)

    raw = requests.get(outbreak_link, headers)
    content = BeautifulSoup(raw.content, 'html.parser')

    syndicates = content.find_all('div', class_="syndicate")

    article = helper.new_article(past_outbreak)

    # headline
    article["headline"] = syndicates[0].get_text()

    # date_of_publication
    article["date_of_publication"] = helper.get_date_of_publication(content)

    # main_text
    past_details = ""
    past_investigation = content.find('a', string="Previous Updates")
    if(past_investigation):
        past_investigation_link = past_investigation["href"]
        past_investigation_link = urllib.parse.urljoin(cdc_base_url, past_investigation_link)
        raw0 = requests.get(past_investigation_link, headers)
        content0 = BeautifulSoup(raw0.content, 'html.parser')
        past_details = content0.find('div', class_="card-body")
        past_details = past_detials.get_text()

    article["main_text"] = syndicates[1].get_text() + past_details
    report = helper.new_report()

    # diseases
    report["diseases"] = ["salmonellosis"]
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

print(">>>> Sars")
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
        tags = h3.find_next_sibilings('p', align=False)
        for t in tags:
            main_text = main_text + t + "\n"
        print(main_text)
        article["main_text"] = main_text
        
        report = helper.new_report()
        report["diseases"] = ["sars"]
        report["syndromes"] = helper.get_syndromes(main_text)
        report["event_date"] = helper.get_date(main_text)
        locations = helper.get_locations(main_text)
        for lo in locations:
            item = {}
            item["geonames_id"] = lo
            report["locations"].append(item)

        article["reports"].append(report)
    else:
        syndicates = content.find_all('div', class_="syndicate")

        article = helper.new_article(sars_link)
        article["date_of_publication"] = helper.get_date_of_publication(content)
        article["headline"] = syndicates[0].get_text()

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
        report["diseases"] = ["sars"]
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
        #print('------------')

f.close()
