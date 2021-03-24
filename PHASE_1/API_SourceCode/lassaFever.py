from bs4 import BeautifulSoup 
import requests, json
import helper, time
import re, urllib.parse

f = open("lassaFever.json", "w", encoding='utf8')

base_url = "https://www.cdc.gov"
lassa_url = "https://www.cdc.gov/vhf/lassa/index.html"

lassa_page = requests.get(lassa_url)

soup = BeautifulSoup(lassa_page.text, 'html.parser')

lassa_list = []
lassa_list.append(lassa_url)
lassa_list.append("https://www.cdc.gov/vhf/lassa/outbreaks/index.html")

for new_url in lassa_list:

    next_url = requests.get(new_url)

    soup = BeautifulSoup(next_url.text, 'html.parser')


    article = helper.new_article(new_url)
    report = helper.new_report()

    article['date_of_publication'], article['headline'] = helper.get_date_headline(soup.find('head'), soup.find('main'), next_url)

    main_text = []
    syndicates = soup.find_all('div', class_='syndicate')

    if (syndicates):
        for s in syndicates:
            main_text.append(" ")
            main_text.append(s.get_text())

    main_text = "\n".join(main_text).strip()

    article['main_text'] = main_text

    report['diseases'] = helper.get_diseases(main_text)
    report['syndromes'] = helper.get_syndromes(main_text)
    report['event_date'] = helper.get_date(main_text)

    locations = []
    item = {}
    locations_list = helper.get_locations(main_text)
    for l in locations_list:
        item["geonames_id"] = helper.get_geoname_id(l)
        locations.append(item)
    report["locations"] = locations
    article['reports'].append(report)

    json.dump(article, f, ensure_ascii=False)
    f.write(',\n')
