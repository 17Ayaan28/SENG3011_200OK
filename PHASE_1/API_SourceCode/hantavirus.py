## Libraries required for web scraping
from bs4 import BeautifulSoup 
import requests, json
import helper
import re

base_url = "https://www.cdc.gov"

hanta_url = "https://www.cdc.gov/hantavirus/outbreaks/index.html"

hanta_page = requests.get(hanta_url)

soup = BeautifulSoup(hanta_page.text, 'html.parser')

url_linked_list = soup.find('ul', id='nav-group-c016f')
url_list = url_linked_list.find_all('a')

pText = soup.find_all('p')
#print(url_list, "\n", pText)

for url in url_list:

    next_url = base_url + url.get('href')

    next_page = requests.get(next_url)

    soup = BeautifulSoup(next_page.text, 'html.parser')

    article = helper.new_article(next_url)
    report = helper.new_report()

    article['date_of_publication'], article['headline'] = helper.get_date_headline(soup.find('head'), soup.find('main'), next_url)

    main_text = []
    syndicates = soup.find_all('div', class_='syndicate')

 
    if (syndicates):
        main_text=[]
        for s in syndicates:
            main_text.append(" ")
            main_text.append(s.get_text().replace('\n', ' '))
        main_text = "\n".join(main_text).strip()

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
    article['reports'].append(report)

    print(article)
