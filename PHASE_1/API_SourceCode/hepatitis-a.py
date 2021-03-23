import time
import requests, json
from bs4 import BeautifulSoup
import urllib.parse, re
import scraper

scraper.scraper("hepatitis-a", "https://www.cdc.gov/hepatitis/outbreaks/2017March-HepatitisA.htm")
scraper.scraper("hepatitis-a", "https://www.cdc.gov/hepatitis/outbreaks/2019/hav-berries/index.htm")
scraper.scraper("hepatitis-a", "https://www.cdc.gov/hepatitis/outbreaks/2016/hav-strawberries.htm")
scraper.scraper("hepatitis-a", "https://www.cdc.gov/hepatitis/outbreaks/2016/hav-hawaii.htm")
scraper.scraper("hepatitis-a", "https://www.cdc.gov/hepatitis/outbreaks/2013/a1b-03-31/index.html")

