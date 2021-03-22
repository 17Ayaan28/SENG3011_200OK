import json, re, requests
from bs4 import BeautifulSoup
from datetime import datetime
import spacy

nlp = spacy.load("en_core_web_sm")

api_get_place_id = "http://api.geonames.org/searchJSON?"
api_get_place_name = "api.geonames.org/get?"

def read_list(file):
    f = open(file, "r")
    data = f.read()
    f.close()

    return json.loads(data)

    
def get_az_list():
    return ['m', 'n', 'p', 'q', 'r']

def get_disease_json_name(new_name):
    names = {"marburg hemorrhagic fever": "marburg virus disease",
             "nipah virus infection": "nipah virus",
             "pneumococcal disease": "pneumococcus pneumonia",
             "poliomyelitis infection": "poliomyelitis"}

    return names[new_name]


disease_list = read_list('dataset/diseases_15.json')
syndrome_list = read_list('dataset/syndromes.json')


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

def remove(string):
    string = re.sub(r'[^0-9a-zA-Z]', '', string)
    return string

def convert_month(month):
    #date_string = re.sub(r'\.', '', date_string)
    print(month)
    if(month == "Jan" or month == "January"):
        return "1"
    elif(month == "Feb" or month == "February"):
        return "2"
    elif(month == "Mar" or month == "March"):
        return "3"
    elif(month == "Apr" or month == "April"):
        return "4"
    elif(month == "May"):
        return "5"
    elif(month == "Jun" or month == "June"):
        return "6"
    elif(month == "Jul" or month == "July"):
        return "7"
    elif(month == "Aug" or month == "Augest"):
        return "8"
    elif(month == "Sep" or month == "September"):
        return "9"
    elif(month == "Oct" or month == "October"):
        return "10"
    elif(month == "Nov" or month == "November"):
        return "11"
    else:
        return "12"


def get_date(text):

    pattern4 = "(Jan(?:uary)?.?|Feb(?:ruary)?.?|Mar(?:ch)?.?|Apr(?:il)?.?|May?|Jun(?:e)?.?|Jul(?:y)?.?|Aug(?:ust)?.?|Sep(?:tember)?.?|Oct(?:ober)?.?|Nov(?:ember)?.?|Dec(?:ember)?.?)? ([0-9]?[0-9],?)?\s?([0-9]{4})?\s?(and|to|through) (Jan(?:uary)?.?|Feb(?:ruary)?.?|Mar(?:ch)?.?|Apr(?:il)?.?|May?|Jun(?:e)?.?|Jul(?:y)?.?|Aug(?:ust)?.?|Sep(?:tember)?.?|Oct(?:ober)?.?|Nov(?:ember)?.?|Dec(?:ember)?.?)?\s?([0-9]?[0-9],?)?\s?(2[0-9]{3})"
    matches4 = re.findall(pattern4, text, re.DOTALL)
    date = ""
    if(len(matches4) > 0):
        start_month = convert_month(remove(matches4[0][0]))
        start_day = remove(matches4[0][1])
        start_year = remove(matches4[0][2])

        end_month = convert_month(remove(matches4[0][4]))
        end_day = remove(matches4[0][5])
        end_year = remove(matches4[0][6])

        if(start_year):
            if(start_month):
                if(start_day):
                    date = start_year + "-" + start_month + "-" + start_day + " xx:xx:xx"
                else:
                    date = start_year + "-" + start_month + "-" +  "xx" + " xx:xx:xx"
            else:
                date = start_year + "-" + "xx" + "-" + "xx" + " xx:xx:xx"
        else:
            if(start_month):
                if(start_day):
                    date = end_year + "-" + start_month + "-" + start_day + " xx:xx:xx" 
                else:
                    date = end_year + "-" + start_month + "-" + "xx" + " xx:xx:xx"
            else:
                if(start_day):
                    date = end_year + "-" + end_month + "-" + start_day + " xx:xx:xx"
                
        if(end_month):
            if(end_day):
                date = date + " to " + end_year + "-" + end_month + "-" + end_day + " xx:xx:xx"
            else:
                date = date + " to " + end_year + "-" + end_month + "-" + "xx" + " xx:xx:xx"
        else:
            date = date + " to " + end_year + "-xx-xx xx:xx:xx"
    else:
        # extact date
        date = get_date1(text)
    
    return date
    


    """
    pattern = "(Jan(?:uary)?.?|Feb(?:ruary)?.?|Mar(?:ch)?.?|Apr(?:il)?.?|May?|Jun(?:e)?.?|Jul(?:y)?.?|Aug(?:ust)?.?|Sep(?:tember)?.?|Oct(?:ober)?.?|Nov(?:ember)?.?|Dec(?:ember)?).? ([0-9]?[0-9])(,?) ([0-9]{4})"
    date_string = re.compile(pattern).search(text).group(0)
    date_string = convert_month(date_string)
    date_object = datetime.strptime(date_string, "%B %d, %Y")
    date = date_object.strftime('%Y-%m-%d')
    return date + " xx:xx:xx"
    """

def convert_month(date_string):
    date_string = re.sub(r'\.', '', date_string)
    date_string = re.sub(r'Jan ', 'January ', date_string)
    date_string = re.sub(r'Feb ', 'February ', date_string)
    date_string = re.sub(r'Mar ', 'March ', date_string)
    date_string = re.sub(r'Apr ', 'April ', date_string)
    date_string = re.sub(r'Jun ', 'June ', date_string)
    date_string = re.sub(r'Jul ', 'July ', date_string)
    date_string = re.sub(r'Aug ', 'Augest ', date_string)
    date_string = re.sub(r'Sep ', 'September ', date_string)
    date_string = re.sub(r'Oct ', 'October ', date_string)
    date_string = re.sub(r'Nov ', 'November ', date_string)
    date_string = re.sub(r'Dec ', 'December ', date_string)

    return date_string

def get_date1(text):
    # Extact
    # Month Day, Year
    pattern1 = "(Jan(?:uary)?.?|Feb(?:ruary)?.?|Mar(?:ch)?.?|Apr(?:il)?.?|May?|Jun(?:e)?.?|Jul(?:y)?.?|Aug(?:ust)?.?|Sep(?:tember)?.?|Oct(?:ober)?.?|Nov(?:ember)?.?|Dec(?:ember)?.?) ([0-9]?[0-9],?) (2[0-9]{3})"
    matches1 = re.findall(pattern1, text, re.DOTALL)
    matches1_complete = []
    for match1 in matches1:
        month = convert_month(remove(match1[0]))
        day = remove(match1[1])
        year = match1[2]

        matches1_complete.append(year+"-"+month+"-"+day+" xx:xx:xx")

    # Month Year
    pattern2 = '(Jan(?:uary)?.?|Feb(?:ruary)?.?|Mar(?:ch)?.?|Apr(?:il)?.?|May?|Jun(?:e)?.?|Jul(?:y)?.?|Aug(?:ust)?.?|Sep(?:tember)?.?|Oct(?:ober)?.?|Nov(?:ember)?.?|Dec(?:ember)?.?) (2[0-9]{3})'
    matches2 = re.findall(pattern2, text, re.DOTALL)
    matches2_complete = []
    for match2 in matches2:
        month = convert_month(remove(match2[0]))
        year = match2[1]
        matches2_complete.append(year+"-"+month+"-"+"xx xx:xx:xx")

    # Year
    pattern3 = "(2[0-9]{3})"
    matches3 = re.findall(pattern3, text, re.DOTALL)
    matches3_complete = []
    for match3 in matches3:
        matches3_complete.append(match3+"-xx-xx xx:xx:xx")

    complete = matches1_complete + matches2_complete + matches3_complete
    # sort
    complete.sort()

    if(complete):
        return complete[0]
    else:
        return ""
    # Range
    #pattern4 = "(Jan(?:uary)?.?|Feb(?:ruary)?.?|Mar(?:ch)?.?|Apr(?:il)?.?|May?|Jun(?:e)?.?|Jul(?:y)?.?|Aug(?:ust)?.?|Sep(?:tember)?.?|Oct(?:ober)?.?|Nov(?:ember)?.?|Dec(?:ember)?.?)? ([0-9]?[0-9],?)? ([0-9]{4})? and|to|through (Jan(?:uary)?.?|Feb(?:ruary)?.?|Mar(?:ch)?.?|Apr(?:il)?.?|May?|Jun(?:e)?.?|Jul(?:y)?.?|Aug(?:ust)?.?|Sep(?:tember)?.?|Oct(?:ober)?.?|Nov(?:ember)?.?|Dec(?:ember)?.?)? ([0-9]?[0-9],?)? ([0-9]{4})"
    #matches4 = re.findall(pattern4, text, re.DOTALL)
    #print(matches4)

    #pattern5 = "(Jan(?:uary)?.?|Feb(?:ruary)?.?|Mar(?:ch)?.?|Apr(?:il)?.?|May?|Jun(?:e)?.?|Jul(?:y)?.?|Aug(?:ust)?.?|Sep(?:tember)?.?|Oct(?:ober)?.?|Nov(?:ember)?.?|Dec(?:ember)?.?) ([0-9]{4}) to|through (Jan(?:uary)?.?|Feb(?:ruary)?.?|Mar(?:ch)?.?|Apr(?:il)?.?|May?|Jun(?:e)?.?|Jul(?:y)?.?|Aug(?:ust)?.?|Sep(?:tember)?.?|Oct(?:ober)?.?|Nov(?:ember)?.?|Dec(?:ember)?.?) ([0-9]{4})"
    #matches5 = re.findall(pattern5, text, re.DOTALL)

    #pattern6 = ""


def get_event_date(text):
    doc = nlp(text)
    for ent in doc.ents:
        if (ent.label_ == "DATE"):
            tmp = ent.text
            if (tmp.lower().startswith(('jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'))):
                return ent.text
    return None

def get_locations(text):
    doc = nlp(text)
    res = set()
    #print([(ent.text, ent.label_) for ent in doc.ents])
    for ent in doc.ents:
        if (ent.label_ == "GPE"):
            res.add(ent.text)
    return list(res)

def get_geoname_id(place_name):

    parameters = {
        "username": "ellend",
        "name": place_name
    }

    response = requests.get(api_get_place_id, params=parameters)

    geonames_id = response.json()["geonames"]
    geonames_id = geonames_id[0]["geonameId"] if len(geonames_id) > 0 else -1

    return geonames_id

text = "Nov. 12, 2021"
print(get_date1(text))
