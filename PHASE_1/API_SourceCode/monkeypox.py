# import scraper
import time
import requests, json
from bs4 import BeautifulSoup
import urllib.parse, re
import scraper

scraper.scraper("monkeypox", "https://www.cdc.gov/poxvirus/monkeypox/outbreak.html")