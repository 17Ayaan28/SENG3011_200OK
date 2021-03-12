## Libraries required for web scraping
from bs4 import BeautifulSoup 
import requests

## Used to convert python dicts to json
import json

## Used to connect to python database
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

import re



base_url = "https://www.cdc.gov/salmonella/typhimurium-02-21/index.html"


cdc_r = requests.get(base_url)


soup = BeautifulSoup(cdc_r.text, 'html.parser')

current_outbreaks_list = soup.find_all('ul', id="nav-group-04e9a")

#regex wont work
li_list = current_outbreaks_list[0].select("li")

for l in li_list:
	t = l.find('em')
	if t is not None:
		n = t.find_parent('a')
		print(n)