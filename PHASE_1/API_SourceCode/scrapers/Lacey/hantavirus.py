import time
import requests, json
from bs4 import BeautifulSoup
import urllib.parse, re
from scraper1 import scraper

scraper("hantavirus", "https://www.cdc.gov/hantavirus/outbreaks/seoul-virus/index.html")
scraper("hantavirus", "https://www.cdc.gov/hantavirus/outbreaks/yosemite/index.html")
scraper("hantavirus", "https://www.cdc.gov/hantavirus/outbreaks/history.html")
