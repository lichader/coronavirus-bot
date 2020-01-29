import requests
import json

url = 'https://view.inews.qq.com/g2/getOnsInfo?name=wuwei_ww_area_counts'
data = json.loads(requests.get(url).json()['data'])

# print(data)