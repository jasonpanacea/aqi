#!/usr/local/bin/python
# -*- coding: utf-8 -*-
import csv, requests, json, time


class DataLoader(object):
    def __init__(self, file, url):
        self.file = file
        self.url = url
        self.data = {}
        self.items = []

    def _process_file(self):
        with open(self.file, 'rb') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if not row['PM25'] or not row['AQI'] or not row['PM10']:
                    continue
                if (row['TIME_POINT'], row['AREA_CODE'], row['POSITION_NAME']) in self.data:
                    continue
                self.data[(row['TIME_POINT'], row['AREA_CODE'], row['POSITION_NAME'])] = row

    def _process_item(self):
        for item in self.data.values():
            timestamp = int(round(time.mktime(time.strptime(item['TIME_POINT'], "%Y-%m-%d %H:%M:%S"))*1000))
            tags = {
                "province":item['PROVINCE'],
                "city":item['CITY'],
                "district":item['DISTRICT'],
                "quality":item['QUALITY'],
                "latitude":item['LATITUDE'],
                "longtitude":item['LONGITUDE'],
                "position_name":item['POSITION_NAME'],
                }
            aqi = {"name": "aqi","timestamp":timestamp,"value":float(item['AQI']), "tags":tags}
            pm25 = {"name": "pm25","timestamp":timestamp,"value":float(item['PM25']), "tags":tags}
            pm10 = {"name": "pm10","timestamp":timestamp,"value":float(item['PM10']), "tags":tags}
            self.items += [aqi, pm25, pm10]

    def post_data(self):
        self._process_file()
        self._process_item()
        data = json.dumps(self.items, ensure_ascii=False)
        r = requests.post(self.url, data=data)
        return r.status_code == 204
        

def main():
    dl = DataLoader('./hlj.csv', 'http://localhost:8080/api/v1/datapoints')
    dl.post_data()

if __name__ == '__main__':
    main()