from bs4 import BeautifulSoup
import requests

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

cred = credentials.Certificate('/Users/ayaanadil/Desktop/SENG3011/')

firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://quick-9e9b1-default-rtdb.firebaseio.com/'
})

ref = db.reference("/")
ref.set({
	"test":
	{
		"test": 1
	}
})

url = "https://www.cdc.gov/outbreaks/"

cdc_r = requests.get(url)



cdc_soup = BeautifulSoup(cdc_r.text, 'html.parser')


for link in cdc_soup.find_all('a', attrs={'class':'feed-item-title'}):
	title = link.getText()
	print(title)