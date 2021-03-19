import time
import re





strdate1 = "2019-10-10T23:25:xx"
strdate2 = "2019-11-10T23:xx:xx"
pattern = '^(\d{4})-(\d\d|xx)-(\d\d|xx)T(\d\d|xx):(\d\d|xx):(\d\d|xx)$'

if re.match(pattern, strdate1) and re.match(pattern, strdate2):
    strdate1_m = strdate1.replace("xx", "01")
    strdate2_m = strdate2.replace("xx", "01")

    try:
        time.strptime(strdate1_m, "%Y-%m-%dT%H:%M:%S")
        time.strptime(strdate2_m, "%Y-%m-%dT%H:%M:%S")
        print(True)
    except:
        print(False)
else:
    print(False)