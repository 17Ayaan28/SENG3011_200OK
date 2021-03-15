import json, re
from bs4 import BeautifulSoup

def read_list(file):
    f = open(file, "r")
    data = f.read()
    f.close()

    return json.loads(data)


disease_list = read_list('diseases.json')
syndrome_list = read_list('syndromes.json')


def new_article(url):
    article = {
        "url": url,
        "date_of_publication": "",
        "headline": "",
        "main_text": "",
        "reports": []
    }

    return article

def new_report():
    report = {
        "diseases": [],
        "syndromes": [],
        "event_date": "",
        "locations": []
    }

    return report

def get_date_headline(head, main, url):

    #headline = head.find('title')
    #headline = headline.get_text() if headline else ""
    """
    headline = main.find('h1') if main else head.find('title')
    if(main):
        headline = headline if headline else main.find('h3')
    headline = headline.get_text() if headline else ""
    """
    #print('\n\n----------')
    #print(main)
    #print('url ', url)
    headline = ""
    if(main):
        #print('url ', url)
        headline = main.find('h1')
        #print('h1 ', headline)
        if(not headline):
            headline = main.find('h3')
            #print('h3 headline')
    #print('----------\n\n')

    if(not headline):
        headline = head.find('title')

    headline = headline.get_text() if headline else ""
    #print(headline)
    if(re.compile(" - ").search(headline)):
        headline = headline[:headline.find(" - ")]
    elif(re.compile(" | ").search(headline)):
        headline =  headline[:headline.find(" | ")]
        
    #print(headline)
    #print('-----------\n\n')

    # date format: 2018-11-01 xx:xx:xx
    #date = head.find('meta', property='article:published_time')
    date_of_publication = head.find('meta', property='article:published_time')
    date_of_publication = date_of_publication['content'] + ' xx:xx:xx' if date_of_publication else ""
    
    return date_of_publication, headline

def get_main_text():
    pass

def get_diseases(text):

    diseases = []
    if(text):
        text = text.lower()
        for disease in disease_list:
            if disease['name'] == 'other' or disease['name'] == 'unknown':
                continue
            if disease['name'].lower() in text:
                diseases.append(disease['name'])
    return diseases

def get_syndromes(text):
    
    syndromes = []
    if(text):
        text = text.lower()
        for syndrome in syndrome_list:
            if syndrome['name'] == 'other' or syndrome['name'] == 'unknown':
                continue
            if syndrome['name'].lower() in text:
                syndromes.append(syndrome['name'])
    return syndromes

def get_event_date(text):
    pass

def get_locations(text):
    pass
