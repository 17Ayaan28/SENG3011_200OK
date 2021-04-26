import requests
from bs4 import BeautifulSoup, NavigableString
import re

def country_vaccine(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
        
    country_name = request.args.get("country_name")

    headers1 = {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
      "accept-encoding": "gzip,deflate,sdch",
      "accept-language": "en-US,en;q=0.8"
    }
    url = "https://wwwnc.cdc.gov/travel/destinations/traveler/none/" + country_name
    vaccines = []
    recommendations = []

    raw = requests.get(url, headers1)
    content = BeautifulSoup(raw.content, 'html.parser')

    vaccine_table = content.find('table', id='dest-vm-a')

    if(vaccine_table):
        vaccine_table_body = vaccine_table.find('tbody')

        names = vaccine_table_body.find_all('td', class_="clinician-disease")
        res = vaccine_table_body.find_all('td', class_="clinician-recomendations")
        
        for x in range(0, len(names)):
            vaccine = {}
            vaccine['name'] = names[x].get_text().replace("\n", "")
            text = ''
            
            children_text = []
       
            for child in res[x].children:
              
                if(not isinstance(child, NavigableString)):
                    t = child.get_text()
                    string = str(child)
                   
                    if(re.match(r'^<li>', string)):
                     
                        t = "- " + t
  
                    children_text.append(t)
                    text = '\n'.join(children_text)
    
            vaccine['recommendation'] = text
            vaccines.append(vaccine)
    vaccine = {}
    vaccine['name'] = 'COVID-19'
    vaccine['recommendation'] = 'Fully vaccinated travellers are less likely to get and spread COVID-19. However, international travel poses additional risks and even fully vaccinated travelers are at increased risk for getting and possibly spreading new COVID-19 variants.\n' + 'CDC recommends delaying international travel until you are fully vaccinated.\n' + 'Do not travel internationally until you are fully vaccinated.\n' + 'If you are fully vaccinated with an FDA-authorized vaccine, you should continue to follow CDC’s recommendations for traveling safely and get tested 3-5 days after travel.\n' + 'You do NEED to get covid negative test, 1-3 days before arrival.\n' + 'Recommend to carry proofs of vaccination\n' + 'You do NEED to self-quarantine after arrival.\n' 

    vaccines.append(vaccine)
    headers = {
        'Access-Control-Allow-Origin': '*',
    }
    return {'vaccines': vaccines}, 200, headers
