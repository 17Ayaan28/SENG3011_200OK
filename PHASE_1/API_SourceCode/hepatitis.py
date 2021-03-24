## Libraries required for web scraping
from bs4 import BeautifulSoup 
import requests, json
import helper
import re

f = open("hepatitis.json", "w", encoding='utf8')


base_url = "https://www.cdc.gov"

hepa_url = "https://www.cdc.gov/hepatitis/outbreaks/hepatitisaoutbreaks.htm"
hepa_page = requests.get(hepa_url)

soup = BeautifulSoup(hepa_page.text, 'html.parser')


url_linked_list1 = soup.find('ul',id="nav-group-bb580") #and not(soup.find("list-group-item nav-lvl3"))

url_list = url_linked_list1.find_all('a')
url_list.append(hepa_url)
 
url_linked_list2 = soup.find('li', id='nav-group-5805c')
url_list2 = soup.find_all(lambda tag: tag.name=='a' and tag.has_attr('href') and tag['href'].endswith('/Heathcare-associatedOutbreaks.htm'))
url_list2_2 = soup.find_all(lambda tag: tag.name=='a' and tag.has_attr('href') and tag['href'].endswith('/HCVOutbreaks-PWID.htm'))
url_list2_21 = soup.find_all(lambda tag: tag.name=='a' and tag.has_attr('href') and tag['href'].endswith('/blooddonorinfections.htm'))
url_list += url_list2 + url_list2_2 + url_list2_21

print(url_list, '\n-----------------')
for url in url_list:
    
    if (str(url).startswith(base_url)):
        next_url = url
    else:
        next_url = base_url + url.get('href')
        
    notReport = re.match("^.*.gov#nav-group-[0-9a-z]{5}$", str(url))
    if notReport:
        continue
    
    next_page = requests.get(next_url)
    soup = BeautifulSoup(next_page.text, 'html.parser')

    article = helper.new_article(next_url)
    report = helper.new_report()

    article['date_of_publication'], article['headline'] = helper.get_date_headline(soup.find('head'), soup.find('main'), next_url)

    main_text = []
    syndicates = soup.find_all('div', class_='syndicate')

 
    if (syndicates):
        main_text=[]
        for s in syndicates:
            main_text.append(" ")
            main_text.append(s.get_text().replace('\n', ' '))

    if not(syndicates):
        for para in soup.find_all('p'):
            para=str(para).replace('<p>', ' ')
            para=str(para).replace('</p>', ' ')
            para=str(para).replace('\n', ' ')
            main_text.append(para)
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