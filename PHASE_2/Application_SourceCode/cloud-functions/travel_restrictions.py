import requests
from bs4 import BeautifulSoup


def travel_restriction(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.

    """

    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers2 = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers2)
        
    country_name = request.args.get("country_name")
    country_region = request.args.get("country_region")


    url = "https://trutrip.co/covidentrycheck/travel-restrictions/" + country_region + '/' + country_name + '?lang=en'

    headers1 = {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
      "accept-encoding": "gzip,deflate,sdch",
      "accept-language": "en-US,en;q=0.8"
    }

    raw = requests.get(url, headers1)
    content = BeautifulSoup(raw.content, 'html.parser')

    text = ''

    section = content.find('div', class_='section')
    if(section):
        info = section.find('div', class_='col-12 col-md-10 col-lg-9')

        if(info):
            ps = info.find_all('p')

            if(ps):
                children_text = []
                for p in ps:
                    t = p.get_text().strip()
                    if(p.get('class') and p.get('class')[0] == 'font-weight-bold'):
                        t = '\n' + t + '\n'
                    children_text.append(t)
                    text = '\n'.join(children_text)


    headers = {
        'Access-Control-Allow-Origin': '*',
    }

    return {'info': text}, 200, headers
