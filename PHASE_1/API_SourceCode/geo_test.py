import geocoder
import time


def geochild(g):
    c = geocoder.geonames(g.geonames_id, key = uname, method = 'children')
    if not c:
        return True
    else:
        for addr in c:
            geo_list.append(addr.address)
            geochild(addr)


uname = 'matthewxoy'

#location = 'New South Wales'
#location = 'U.S.A'
#location2 = 'Ohio'
#location = 'abcde'

'''
g = geocoder.geonames(location, key = uname)
s = geocoder.geonames(location2, key = uname)
print(s.geonames_id)
print(g.geojson)
if not g or not location:
    print("Invalid location")
else:
    c = geocoder.geonames(g.geonames_id, key = uname, method = 'children')
    for addr in c:
        print(addr.address)
        if addr.geonames_id == s.geonames_id:
            print(location2)

t = geocoder.geonames(226074, method ='details', key = uname)
print(t.address)
'''


#print(g.geojson)



request_time = time.time()


location = 'Zetland'
geo_list = [location]
g = geocoder.geonames(location, key = uname)
h = geocoder.geonames(g.geonames_id, method = 'hierarchy', key = uname)


for addr in h:
    print(addr.address)

#geochild(g)
#print(geo_list)

response_time = time.time()
time_spent = response_time - request_time
print("Excution time:", time_spent)
