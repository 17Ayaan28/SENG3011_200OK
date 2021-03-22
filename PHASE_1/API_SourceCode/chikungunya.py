## Libraries required for web scraping
from bs4 import BeautifulSoup 
import requests, json
import helper
import re

base_url = "https://www.cdc.gov"

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

	article['date_of_publication'], article['headline'] = helper.get_date_headline(soup.find('head'), soup.find('main'), next_url)

	main_text = []
	syndicates = soup.find_all('div', class_='syndicate')

	if (syndicates):
	    for s in syndicates:
	        main_text.append(s.get_text())

	main_text = "\n".join(main_text).strip()

	article['main_text'] = main_text

	report['diseases'] = helper.get_diseases(main_text)
	report['syndromes'] = helper.get_syndromes(main_text)
	article['reports'].append(report)

	print(article)
	