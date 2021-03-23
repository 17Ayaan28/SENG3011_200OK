import requests, json
from bs4 import BeautifulSoup
import urllib.parse, re
import helper
import time

def not_empty(href):
    return href and not re.compile("^$").search(href)

def scraper(disease, url):
    f = open(disease + ".json", "a")

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

    article['date_of_publication'], article['headline'] = helper.get_date_headline(soup.find('head'), soup.find('main'), URL)

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
    doc = helper.nlp_doc(main_text)
    report['event_date'] = helper.get_date(main_text)

    report['locations'] = helper.get_locations(doc)

    if (report['diseases'] and report['event_date'] and report['locations']):
        json.dump(article, f)

    f.close()
    
