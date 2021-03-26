# This file need to be run in API_SourceCode

import sys
sys.path.append("..")
from API_SourceCode import helper

main = "As of November 20, 2020, Fever of unknown Origin 18 people infected crimean-congo haemorrhagic fever with the outbreak strain of Salmonella Muenster were reported  from 11 states. 11 ill people were hospitalized, and no deaths were reported. 6 ill people were children under 5 years of age. Epidemiologic and laboratory evidence showed that contact with pet bearded dragons was the likely source of this outbreak. In interviews, 11 (69%) of 16 ill people reported contact with a bearded dragon before getting sick. Ill people reported purchasing bearded dragons from pet stores in multiple states. A common supplier was not identified. The outbreak strain making people sick was identified in samples collected from a bearded dragon and its environment from the home of an ill person in Virginia. This outbreak investigation is over. CDC will continue to work with state public health partners to monitor for Salmonella infections linked to contact with pet bearded dragons."
main2 = "As of November 20, 2020, 18 people infected crimean-congo haemorrhagic fever with the outbreak Fever of unknown Origin strain of Salmonella Muenster were reported from 11 states. Encephalitis 11 ill people were plague hospitalized, and no deaths were reported. 6 ill people were children under 5 years of age. Epidemiologic and laboratory evidence showed that contact with pet bearded dragons was the likely source of this outbreak. In interviews, 11 (69%) of 16 ill people reported contact with a bearded dragon before getting sick. Ill people reported purchasing bearded dragons from pet stores in multiple states. A common supplier was not identified. The outbreak strain making people sick was identified in samples collected from a bearded dragon and its environment from the home of an ill person in Virginia. This outbreak investigation is over. CDC will continue to work with state public health partners to monitor for Salmonella infections linked to contact with pet bearded dragons."

def test_get_date():
    date1 = "May 12, 2020"
    date2 = "May 2020"
    date3 = "2020"
    date4 = "May 12 2020 and Jun. 12 2020 "
    date5 = "May 12 2020 to Jun. 12 2020 "
    date6 = "May 12 2020 through Jun. 12 2020 "
    date7 = "12 through Jun. 12 2020 "

    result1 = helper.get_date(date1)
    result2 = helper.get_date(date2)
    result3 = helper.get_date(date3)
    result4 = helper.get_date(date4)    
    result5 = helper.get_date(date5)
    result6 = helper.get_date(date6)

    assert result1 == "2020-5-12 xx:xx:xx"
    assert result2 == "2020-5-xx xx:xx:xx"
    assert result3 == "2020-xx-xx xx:xx:xx"
    assert result4 == "2020-5-12 xx:xx:xx to 2020-6-12 xx:xx:xx"
    assert result5 == "2020-5-12 xx:xx:xx to 2020-6-12 xx:xx:xx"
    assert result6 == "2020-5-12 xx:xx:xx to 2020-6-12 xx:xx:xx"

def test_get_location():
    result1 = helper.get_locations("asdfas asdfasdfa sdf Shanghai sdfs asdfes")
    result2 = helper.get_locations(main)
    result3 = helper.get_locations("will continue to work with state public health partners to monitor nfections linked to contact with pet bearded drago Shanghai asdfaa Shanghai")
    result4 = helper.get_locations("ted. 6 ill people were children infections linked to contact with pet bearded drago Shanghai Chongqing")

    assert result1[0] == 1796236
    assert result2[0] == 4801859
    print(result3)
    assert result3[0] == 1796236
    assert len(result3) == 1   # test multiple same location only returned 1 geoid
    assert result4[0] == 1814906
    assert result4[1] == 1796236

def test_get_disease():
    result1 = helper.get_diseases(main)
    assert result1[0] == "crimean-congo haemorrhagic fever"
    result2 = helper.get_diseases(main2)
    assert result2[1] == "plague"

def test_get_syndromes():
    result1 = helper.get_syndromes(main)
    assert result1[0] == "Haemorrhagic Fever"
    assert result1[1] == "Fever of unknown Origin"
    
    result2 = helper.get_syndromes(main2)
    assert result2[2] == "Encephalitis"
