import json, re, requests
from bs4 import BeautifulSoup
from datetime import datetime
import spacy
import geocoder

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


disease_list = read_list('/content/drive/MyDrive/Colab Notebooks/diseases.json')
syndrome_list = read_list('/content/drive/MyDrive/Colab Notebooks/syndromes.json')


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

def get_headline(raw_content):
    main = raw_content.find('main')
    head = raw_content.find('head')
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

    return headline

def get_date_headline(content):
    date_of_publication = get_date_of_publication(content)
    headline = get_headline(content)
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
    if(not month):
        return ""
    #date_string = re.sub(r'\.', '', date_string)
    if(month == "Jan" or month == "January"):
        return "01"
    elif(month == "Feb" or month == "February"):
        return "02"
    elif(month == "Mar" or month == "March"):
        return "03"
    elif(month == "Apr" or month == "April"):
        return "04"
    elif(month == "May"):
        return "05"
    elif(month == "Jun" or month == "June"):
        return "06"
    elif(month == "Jul" or month == "July"):
        return "07"
    elif(month == "Aug" or month == "Augest"):
        return "08"
    elif(month == "Sep" or month == "September"):
        return "09"
    elif(month == "Oct" or month == "October"):
        return "10"
    elif(month == "Nov" or month == "November"):
        return "11"
    else:
        return "12"


    


    """
    pattern = "(Jan(?:uary)?.?|Feb(?:ruary)?.?|Mar(?:ch)?.?|Apr(?:il)?.?|May?|Jun(?:e)?.?|Jul(?:y)?.?|Aug(?:ust)?.?|Sep(?:tember)?.?|Oct(?:ober)?.?|Nov(?:ember)?.?|Dec(?:ember)?).? ([0-9]?[0-9])(,?) ([0-9]{4})"
    date_string = re.compile(pattern).search(text).group(0)
    date_string = convert_month(date_string)
    date_object = datetime.strptime(date_string, "%B %d, %Y")
    date = date_object.strftime('%Y-%m-%d')
    return date + " xx:xx:xx"
    """
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
"""

def get_date1(text):
    # Extact
    # Month Day, Year
    pattern1 = "(Jan(?:uary)?.?|Feb(?:ruary)?.?|Mar(?:ch)?.?|Apr(?:il)?.?|May?|Jun(?:e)?.?|Jul(?:y)?.?|Aug(?:ust)?.?|Sep(?:tember)?.?|Oct(?:ober)?.?|Nov(?:ember)?.?|Dec(?:ember)?.?) ([0-9]?[0-9],?) ([0-9]{4})"
    matches1 = re.findall(pattern1, text, re.DOTALL)
    matches1_complete = []
    for match1 in matches1:
        month = convert_month(remove(match1[0]))
        day = remove(match1[1])
        if(re.match('^\d$', day)):
            day = '0' + day
        year = match1[2]

        matches1_complete.append(year+"-"+month+"-"+day+" xx:xx:xx")

    # Month Year
    pattern2 = '(Jan(?:uary)?.?|Feb(?:ruary)?.?|Mar(?:ch)?.?|Apr(?:il)?.?|May?|Jun(?:e)?.?|Jul(?:y)?.?|Aug(?:ust)?.?|Sep(?:tember)?.?|Oct(?:ober)?.?|Nov(?:ember)?.?|Dec(?:ember)?.?) ([0-9]{4})'
    matches2 = re.findall(pattern2, text, re.DOTALL)
    matches2_complete = []
    for match2 in matches2:
        month = convert_month(remove(match2[0]))
        year = match2[1]
        matches2_complete.append(year+"-"+month+"-"+"xx xx:xx:xx")

    # Year
    pattern3 = "([0-9]{4})"
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
"""
def get_locations(text):
    doc = nlp(text)
    res = set()
    #print([(ent.text, ent.label_) for ent in doc.ents])
    for ent in doc.ents:
        if (ent.label_ == "GPE"):
            res.add(ent.text)
    return list(res)
"""
def get_locations(doc):
    res = set()
    doc = nlp(doc)
    for ent in doc.ents:
        if (ent.label_ == "GPE"):
            g = geocoder.geonames(ent.text,key="ellend")
            if (g and g.geonames_id):
                res.add(g.geonames_id)
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

#text = "Nov. 12, 2021"
#print(get_date1(text))
def review1(text):
    return re.compile("^Page last reviewed").search(text)

def get_date_of_publication(raw_content):
    # get from <head>
    head = raw_content.find('head')
    main = raw_content.find('main')
    url = head.find('link', rel="canonical")
    date = head.find('meta', property="article:published_time") 
    #print(date_of_publication)
    date_of_publication = ""

    time_pattern = '[0-9]?[0-9]\:[0-9]?[0-9](\:[0-9]?[0-9])?'

    if(url):
        url = url["href"]
        #print(url)
        if(re.compile('media/releases/').search(url)):
            #print('haha')
            strong = main.find('h4', text="Press Release")
            p = strong.find_next_sibling('p')
            if(p):  
                date_of_publication = get_date(p.get_text())
                matches = re.search(time_pattern, p.get_text())
                if(matches):
                    #print('--------')
                    times = matches.group(0)
                    times = times.split(':')
                    ts = []
                    #print(times)
                    for t in times:
                        if(re.match('^\d$', t)):
                          t = '0' + t
                        ts.append(t)
                    if(len(ts) == 2):
                        ts.append('xx')
        
                    #print(ts)
                    real_time = ":".join(ts)
                    date_of_publication = date_of_publication[0:11] + real_time
                    #print(date_of_publication)
                    #print('hah')
    else:
        if(date):
            #return get_date(date["content"])
            return date["content"] + " xx:xx:xx"
        else:
            if(main):
                datetime = main.find('p', class_ = 'newupdated-outbreak')
                if (datetime):
                    #print(datetime.get_text())
                    date_of_publication = get_date(datetime.get_text())
                    matches = re.search(time_pattern, datetime.get_text())
                    if(matches):
                        times = matches.group(0)
                        times = times.split(':')
                        ts = []
                        #print(times)
                        for t in times:
                            if(re.match('^\d$', t)):
                              t = '0' + t
                            ts.append(t)
                        if(len(ts) == 2):
                            ts.append('xx')
            
                        #print(ts)
                        real_time = ":".join(ts)
                        date_of_publication = date_of_publication[0:11] + real_time
                    #return date_of_publication
    if(not date_of_publication):
        date = head.find('meta', property="cdc:last_updated")
        if(date):
            date_of_publication = get_date(date["content"])
            matches = re.search(time_pattern, date["content"])
            if(matches):
                times = matches.group(0)
                times = times.split(':')
                ts = []
                #print(times)
                for t in times:
                    if(re.match('^\d$', t)):
                      t = '0' + t
                    ts.append(t)
                if(len(ts) == 2):
                    ts.append('xx')

                #print(ts)
                real_time = ":".join(ts)
                date_of_publication = date_of_publication[0:11] + real_time
        else:
            review = head.find('meta', property="cdc:last_reviewed")
            if(review):
                date_of_publication = get_date(review["content"])
                matches = re.search(time_pattern, review["content"])
                if(matches):
                    times = matches.group(0)
                    times = times.split(':')
                    ts = []
                    #print(times)
                    for t in times:
                        if(re.match('^\d$', t)):
                          t = '0' + t
                        ts.append(t)
                    if(len(ts) == 2):
                        ts.append('xx')
        
                    #print(ts)
                    real_time = ":".join(ts)
                    date_of_publication = date_of_publication[0:11] + real_time

            

    if(not date_of_publication):
        if(main):
            div = main.find('div', text=review1)
            #print(div)
            if(div):
                span = div.find('span')
                #print(span)
            #span = main.find('span', id="last-reviewed-date")
                if(span):
                    date_of_publication = get_date(span.get_text())

    if(not date_of_publication):
        date_of_publication = "0000-00-00 00:00:00"
    
    return date_of_publication



def get_date(text):

    pattern4 = "(Jan(?:uary)?.?|Feb(?:ruary)?.?|Mar(?:ch)?.?|Apr(?:il)?.?|May?|Jun(?:e)?.?|Jul(?:y)?.?|Aug(?:ust)?.?|Sep(?:tember)?.?|Oct(?:ober)?.?|Nov(?:ember)?.?|Dec(?:ember)?.?)?\s?([0-9]?[0-9],?)?\s?([0-9]{4})? (and|to|through) (Jan(?:uary)?.?|Feb(?:ruary)?.?|Mar(?:ch)?.?|Apr(?:il)?.?|May?|Jun(?:e)?.?|Jul(?:y)?.?|Aug(?:ust)?.?|Sep(?:tember)?.?|Oct(?:ober)?.?|Nov(?:ember)?.?|Dec(?:ember)?.?)?\s?([0-9]?[0-9],?)?\s?([0-9]{4})"
    #pattern4 = "(Jan(?:uary)?.?|Feb(?:ruary)?.?|Mar(?:ch)?.?|Apr(?:il)?.?|May?|Jun(?:e)?.?|Jul(?:y)?.?|Aug(?:ust)?.?|Sep(?:tember)?.?|Oct(?:ober)?.?|Nov(?:ember)?.?|Dec(?:ember)?.?)?\s?([0-9]?[0-9],?)?\s?([0-9]{4})?\s(a)"
    matches4 = re.findall(pattern4, text, re.DOTALL)
    #print(matches4)
    date = ""
    if(len(matches4) > 0):
        start_month = convert_month(remove(matches4[0][0]))
        start_day = remove(matches4[0][1])
        if(re.match('^\d$', start_day)):
            start_day = '0' + start_day
        #print(start_day)
        #print(start_month)
        start_year = remove(matches4[0][2])

        end_month = convert_month(remove(matches4[0][4]))
        end_day = remove(matches4[0][5])
        if(re.match('^\d$', end_day)):
            end_day = '0' + end_day
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
                    if(end_month):
                        date = end_year + "-" + end_month + "-" + start_day + " xx:xx:xx"
                    else:
                        date = end_year + "-xx-" + start_day + " xx:xx:xx"
                
        if(end_month):
            if(end_day):
                date = date + " to " + end_year + "-" + end_month + "-" + end_day + " xx:xx:xx"
            else:
                date = date + " to " + end_year + "-" + end_month + "-" + "xx" + " xx:xx:xx"
        else:
            if(end_day):
                date = date + " to " + end_year + "-xx-" + end_day + " xx:xx:xx"
            else:
                date = date + " to " + end_year + "-xx-xx xx:xx:xx"

    else:
        # extact date
        date = get_date1(text)
    
    return date



def fetchDate_Time(someDate_Time):
    checkTime = someDate_Time

    match = re.search(r'\s \d{2}, \d{4}', checkTime)
    match_time1 = re.search(r'\s \d{2}, \d{4} ([Aa]t)? [0-9]?[0-9]\:[0-9]?[0-9](\:[0-9]?[0-9])? ([Aa|Pp][Mm])? (ET|EDT)?', checkTime)

    checkTime = re.sub('[pP]osted ','', checkTime)

    pattern4time = '(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May?|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?) ([0-9]?[0-9])(,?) ([0-9]{4})'
    pattern4time1 = '[0-9]?[0-9]\:[0-9]?[0-9](\:[0-9]?[0-9])?'
    matchTime = re.search(pattern4time, checkTime)
    matchTime1 = re.search(pattern4time1, checkTime)

    if matchTime1 is None:
        if matchTime is None:
            except1 = someDate_Time.find('span', attrs={"class": "text-red"})
            if except1 != None:
                pattern4time = '(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May?|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?) ([0-9]?[0-9])(,?) ([0-9]{4})'
                matchTime = re.search(pattern4time, except1.text)
                s1 = matchTime.group(0)
                d = datetime.strptime(s1, '%B %d, %Y')
                paragraph_text = someDate_Time.find("p")
                dateOfPublication = d.strftime('%Y-%m-%d')
                time = "Txx:xx:xx"
                dateOfPublication1 = dateOfPublication + time
                dateOfPublication = dateOfPublication1
            else:
                dateOfPublication = "xx-xx-xxTxx:xx:xx"
        else:
            s1 = matchTime.group(0)
            d = datetime.strptime(s1, '%B %d, %Y')
            paragraph_text = someDate_Time.find("p")
            dateOfPublication = d.strftime('%Y-%m-%d')
            time = "Txx:xx:xx"
            dateOfPublication = dateOfPublication + time
    else:
            s1 = matchTime.group(0)
            d = datetime.strptime(s1, '%B %d, %Y')
            dateOfPublication = d.strftime('%Y-%m-%d')
            s2 = matchTime1.group(0)
            s2 = "T" + s2
            dateOfPublication = dateOfPublication + s2
    return dateOfPublication
        

"""
raw = requests.get("https://www.cdc.gov/media/releases/2014/p0617-Mers.html")
content = BeautifulSoup(raw.content, 'html.parser')
#print(content.find('meta', property="article:published_time"))
print(get_date_of_publication(content))
"""
#print(fetchDate_Time("Jan 14, 2020"))
