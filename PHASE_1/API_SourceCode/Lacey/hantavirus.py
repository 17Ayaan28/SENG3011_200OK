import time
import requests, json
from bs4 import BeautifulSoup
import urllib.parse, re
from Lacey import scraper

scraper.scraper("hantavirus", "https://www.cdc.gov/hantavirus/outbreaks/seoul-virus/index.html")
scraper.scraper("hantavirus", "https://www.cdc.gov/hantavirus/outbreaks/yosemite/index.html")
scraper.scraper("hantavirus", "https://www.cdc.gov/hantavirus/outbreaks/history.html")
