## Libraries required for web scraping
from bs4 import BeautifulSoup 
import requests, json
import helper
import re

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

    article['date_of_publication'], article['headline'] = helper.get_date_headline(soup.find('head'), soup.find('main'), next_url)

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
    article['reports'].append(report)

    print(article)