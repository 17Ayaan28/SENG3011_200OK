import requests, json
from bs4 import BeautifulSoup
import urllib.parse, re
from collections import deque
import helper

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
stack.append("https://www.cdc.gov/outbreaks/")
visited = deque()
count = 10

while len(stack) > 0 and count > 0:
    URL = stack.popleft()
    visited.append(URL)
    raw = requests.get(URL, headers)

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
        #print(str(main_text))
        #re.sub(r'^\s+|\s+$', '', schoolstring)
        #main_text = re.sub(r'\\n*|\\u[a-z0-9]{4}', ' ', main_text)
        #main_text = re.sub(r'\n+', '\n', main_text)
        #main_text = re.sub(r'\u2019', "'", main_text)
        #main_text = re.sub(r'\u00a0', ' ', main_text)
        #main_text = re.sub(r'\u2014|\u2013', '-', main_text)
        #main_text = re.sub(r'\u201c|\u201d', "\"", main_text)
        #main_text = re.sub(r'\u2265', '>=', main_text)
        #main_text = re.sub(r'\u2026', '...', main_text)
        article['main_text'] = main_text
        #print(main_text)

        report['diseases'] = helper.get_diseases(main_text)
        report['syndromes'] = helper.get_syndromes(main_text)
        article['reports'].append(report)
        """
        article['main_text'] = helper.get_main_text(main

        report['event_date'] = helper.get_event_date()

        report['locations'] = helper.get_locations()

                
        """
        count = count - 1
        json.dump(article, f)
        #f.write('\n------------\n\n')
f.close()
    
