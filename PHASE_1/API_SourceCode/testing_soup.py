## Libraries required for web scraping
from bs4 import BeautifulSoup 
import requests

## Used to convert python dicts to json
import json

## Used to connect to python database
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

cred = credentials.Certificate('/Users/ayaanadil/Desktop/SENG3011/')

firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://quick-9e9b1-default-rtdb.firebaseio.com/'
})



base_url = "https://www.cdc.gov/outbreaks/"

cdc_r = requests.get(base_url)



soup = BeautifulSoup(cdc_r.text, 'html.parser')


#print(cdc_soup.prettify())
outbreak_links_list = soup.find('ul',class_="list-bullet feed-item-list")  ## gets the ul that contains the list of outbreaks along with html


for link in outbreak_links_list.find_all('a'):

	print(link.getText()) ## gets title of text
	print(link.get('href'))
	## also extract date

	link_to_next_page = requests.get(base_url + link.get('href'))
	soup_2 = BeautifulSoup(link_to_next_page, 'html.parser')