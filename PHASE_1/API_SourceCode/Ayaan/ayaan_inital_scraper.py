## Libraries required for web scraping
from bs4 import BeautifulSoup 
import requests, json
import sys
sys.path.append("..")
import helper
import re

## Scraping Reports for Cutaneous and Inhalation Anthrax

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

	article['date_of_publication'], article['headline'] = helper.get_date_headline(soup.find('head'), soup.find('main'), next_url)

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
	
	if (report['diseases'] and report['event_date'] and report['locations']):
		json.dump(article, f)

	# print(article)


#Scraping reports for botulism

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

	article['date_of_publication'], article['headline'] = helper.get_date_headline(soup.find('head'), soup.find('main'), next_url)

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

	print(article)

# Scraping reports for chikungunya

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
	        main_text.append(s.get_text().replace('\n',''))

	main_text = "\n".join(main_text).strip()

	article['main_text'] = main_text

	report['diseases'] = helper.get_diseases(main_text)
	report['syndromes'] = helper.get_syndromes(main_text)
	article['reports'].append(report)

	print(article)

## Dengue Scraping

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


	article['date_of_publication'], article['headline'] = helper.get_date_headline(soup.find('head'), soup.find('main'), next_url)

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

	print(article)


## Ebola Scraping

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

		    	main_text.append(s.get_text().replace('\n',''))

		main_text = "\n".join(main_text).strip()

		article['main_text'] = main_text

		report['diseases'] = helper.get_diseases(main_text)
		report['diseases'].append("ebola haemorrhagic fever")
		report['syndromes'] = helper.get_syndromes(main_text)
		article['reports'].append(report)

		print(article)