## Libraries required for web scraping
from bs4 import BeautifulSoup 
import requests, json
import helper
import re

##cutaneous

base_url = "https://www.cdc.gov"

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