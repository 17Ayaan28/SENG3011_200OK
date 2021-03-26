# import scraper
import time
import requests, json
from bs4 import BeautifulSoup
import urllib.parse, re
from scraper1 import scraper

headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "accept-charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
    "accept-encoding": "gzip,deflate,sdch",
    "accept-language": "en-US,en;q=0.8",
}

URL = ["https://www.cdc.gov/flu/whatsnew.htm", "https://www.cdc.gov/flu/weekly/fluactivitysurv.htm"]
# visited.append(URL)
trycount = 3
succeed = 0
for i in range (1):
    print(URL[i])
    while(trycount > 0):
        try:
            raw = requests.get(URL[i], headers)
            succeed = 1
            break
        except Exception as e:
            if trycount <= 0: 
                print("Failed to retrieve: " + url + "\n" + str(e))
                exit()
            else: 
                print(e)
                trycount -= 1  # retry
            time.sleep(0.5) 

    if (succeed):
        soup = BeautifulSoup(raw.content, 'html.parser')
        main = soup.find('ul', class_="feed-item-list")
        links = main.find_all('a')
        #print(len(links))
        for link in links:
            strLink = str(link['href'])
            if (not strLink.startswith("https://")):
                # strLink = "https://www.cdc.gov" + strLink
                link = urllib.parse.urljoin(URL[i], strLink)
                # print(link)
                scraper("influenze", link)
