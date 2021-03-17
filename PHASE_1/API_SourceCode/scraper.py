import requests, json
from bs4 import BeautifulSoup
import urllib.parse, re
from collections import deque
import helper
import time

f = open("result.json", "w")

headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "accept-charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
    "accept-encoding": "gzip,deflate,sdch",
    "accept-language": "en-US,en;q=0.8",
}

def not_empty(href):
    return href and not re.compile("^$").search(href)

stack = deque()
stack.append("https://www.cdc.gov/coronavirus/2019-nCoV/index.html")
visited = deque()
count = 10
scraped = 1

while len(stack) > 0 and count > 0:
    URL = stack.popleft()
    visited.append(URL)
    trycount = 3
    while(trycount>0):
        try:
            raw = requests.get(URL, headers)
            break
        except Exception as e:
           if trycount <= 0: 
               print("Failed to retrieve: " + url + "\n" + str(e))
               continue 
           else: trycount -= 1  # retry
           time.sleep(0.5) 

    soup = BeautifulSoup(raw.content, 'html.parser')
    #print(soup.original_encoding)
    #a = soup.find('div', class_='syndicate')
    #print(a)
    main = soup.find('main')
    if(main is not None):
        links = main.find_all('a', href=not_empty)
        #print(len(links))
        for link in links:
            strLink = str(link['href'])
            if(not re.compile("^http").search(strLink)):
                l = urllib.parse.urljoin(URL, strLink)
                if(l not in stack and l not in visited):
                    stack.append(l)
            else:
                if(strLink not in stack and strLink not in visited):
                    stack.append(strLink)
    
    if(URL != "https://www.cdc.gov/outbreaks/" and not re.compile("https://www.cdc.gov/other").search(URL) and not re.compile("https://www.cdc.gov/Other").search(URL)):

        article = helper.new_article(URL)
        report = helper.new_report()

        article['date_of_publication'], article['headline'] = helper.get_date_headline(soup.find('head'), soup.find('main'), URL)

        main_text = []
        syndicates = soup.find_all('div', class_='syndicate')
        if (syndicates):
            for s in syndicates:
                main_text.append(s.get_text())

        main_text = "\n".join(main_text).strip()

        article['main_text'] = main_text
        #print(main_text)

        report['diseases'] = helper.get_diseases(main_text)
        report['syndromes'] = helper.get_syndromes(main_text)
        article['reports'].append(report)
    
        # article['main_text'] = helper.get_main_text(main
        doc = helper.nlp_doc(main_text)
        report['event_date'] = helper.get_event_date(doc)

        report['locations'] = helper.get_locations(doc)

        if (report['diseases'] and report['event_date'] and report['locations']):
            count = count - 1
            json.dump(article, f)
            print("scraped " + str(scraped))
            scraped+=1
f.close()
    
