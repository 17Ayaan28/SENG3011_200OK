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
#print(soup.prettify())

current_outbreak_list = soup.find('ul', id='nav-primary',recursive=True)

#print(current_outbreak_list)
pattern = "Previous Outbreaks"
d="a"
for a in current_outbreak_list.find_all('a'):

	result = re.match(pattern,a.get_text())
	
	if(result):
		d = a
		break
		
## put the below stuff ahead in the for loop and convert matches to search
outbreak_list = d.find_parent('li')

pattern_2 = "index.html$"

for a in outbreak_list.find_all('a'):
	result = re.search(pattern_2, a.get('href'))
	if(result):
		print(a.get('href'))
#print(outbreak_list)

#for a in current_outbreak_list:
#	lisp = a.find_all('a',recursive=True)

#for l in lisp:
	
#	print(l.get('href'))