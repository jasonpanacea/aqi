import axios from 'axios';
import moment from 'moment';

import {
    observable,
    computed,
    action,
  } from 'mobx';
  
import RegionStore from './RegionStore';

class BaseStore {
    @observable initial = true;
    @observable loading = false;

    @observable wholeCountryList = [];
    @observable provinceList = [];
    @observable provinceDetail = [];
    @observable cityDetail = [];
    @observable cityQualityDetail = [];

    @observable detailCity = '北京市';

    @observable detailProvince = '';

    @observable cityDetail1 = [];
    @observable cityQualityDetail1 = [];

    @observable cityDetail2 = [];
    @observable cityQualityDetail2 = [];

    @observable cityRank = [];
    @observable provinceRank = [];
  
    @computed get ready() {
      return !this.initial && !this.loading;
    }

  set detailCity(city) {
    this.detailCity = city;
  }

  set detailProvince(province) {
    this.detailProvince = province;
  }
  @action cityQualityDetailForBar(type = this.type.SINGLE) {
    const text = ['优', '良', '轻度污染', '中度污染', '重度污染', '严重污染'];
    const res = [];
    let data = this.cityQualityDetail;
    if (type === this.type.CITY1) { data = this.cityQualityDetail1; } else if (type === this.type.CITY2) { data = this.cityQualityDetail2; }

    if (data.length === 0) { return res; }

    let sum = 0;
    data.slice().forEach((x) => { sum += x.value; });
    if (sum === 0) { return res; }
    text.forEach((x) => {
      let v = 0;
      data.slice().forEach((y) => {
        if (y.name === x) {
          v = Math.round(y.value * 100 / sum);
        }
      });
      res.push(v);
    });
    return res;
  }


  get url() {
    return 'http://cepht.niehs.cn:5443/tsdb/api/v1/datapoints/query';
  }
  get zxs() {
    return ['北京', '上海', '重庆', '天津'];
  }
  get type() {
    return { SINGLE: 'single', CITY1: 'city1', CITY2: 'city2' };
  }

  buildQueryParams(date_unit, date_str) {
    let start = 0;
    let end = 0;
    let unit = 'hours';
    if (date_unit === '小时') {
      start = moment(date_str, 'YYYY-MM-DD HH').unix() * 1000;
      end = start + 59 * 60 * 1000;
    } if (date_unit === '日') {
      start = moment(date_str, 'YYYY-MM-DD').unix() * 1000;
      end = start + 23 * 60 * 60 * 1000;
      unit = 'days';
    } else if (date_unit === '月') {
      const mnt = moment(date_str, 'YYYY-MM');
      start = mnt.unix() * 1000;
      end = start + ((mnt.daysInMonth() - 1) * 24 * 60 * 60 + 23 * 60 * 60) * 1000;
      unit = 'months';
    }
    return [start, end, unit];
  }

  buildQueryParamsForCity(date_unit, start_date, end_date) {
    let start = 0;
    let end = 0;
    let unit = 'hours';
    let sampling = 1;
    if (date_unit === '小时') {
      start = moment(start_date, 'YYYY-MM-DD HH').unix() * 1000;
      end = moment(end_date, 'YYYY-MM-DD HH').unix() * 1000;
      sampling = Math.round((end - start) / (3600 * 1000));
    } if (date_unit === '日') {
      start = moment(start_date, 'YYYY-MM-DD').unix() * 1000;
      end = moment(end_date, 'YYYY-MM-DD').unix() * 1000;
      unit = 'days';
      sampling = Math.round((end - start) / (24 * 3600 * 1000)) + 1;
    } else if (date_unit === '月') {
      start = moment(start_date, 'YYYY-MM').unix() * 1000;
      end = moment(end_date, 'YYYY-MM').unix() * 1000;
      sampling = Math.round((end - start) / (30 * 24 * 3600 * 1000)) + 1;
      unit = 'months';
    }
    return [start, end, unit, sampling];
  }

  buildWholeCountryQuery(date_unit, date_str, name) {
    const params = this.buildQueryParams(date_unit, date_str);
    const query = {
      metrics: [
        {
          tags: {},
          name,
          group_by: [
            {
              name: 'tag',
              tags: [
                'position_name',
              ],
            },
          ],
          aggregators: [
            {
              name: 'avg',
              sampling: {
                value: '1',
                unit: params[2],
              },
              align_start_time: true,
            },
          ],
        },
      ],
      plugins: [],
      cache_time: 0,
      start_absolute: params[0],
      end_absolute: params[1],
    };
    return query;
  }

  buildProvinceListQuery(date_unit, date_str, name) {
    const params = this.buildQueryParams(date_unit, date_str);
    const query = {
      metrics: [
        {
          tags: {},
          name,
          group_by: [
            {
              name: 'tag',
              tags: [
                'province',
              ],
            },
          ],
          aggregators: [
            {
              name: 'avg',
              sampling: {
                value: '1',
                unit: params[2],
              },
              align_start_time: true,
            },
          ],
        },
      ],
      plugins: [],
      cache_time: 0,
      start_absolute: params[0],
      end_absolute: params[1],
    };
    return query;
  }

  buildProvinceDetailQuery(date_unit, date_str, name, provinceName) {
    const params = this.buildQueryParams(date_unit, date_str);
    let group_tag = 'city';
    let province = provinceName;
    if (this.zxs.indexOf(provinceName) >= 0) {
      province += '市';
      group_tag = 'district';
    } else {
      province += '省';
    }
    const query = {
      metrics: [
        {
          tags: {
            province: [
              province,
            ],
          },
          name,
          group_by: [
            {
              name: 'tag',
              tags: [
                group_tag,
              ],
            },
          ],
          aggregators: [
            {
              name: 'avg',
              sampling: {
                value: '1',
                unit: params[2],
              },
              align_start_time: true,
            },
          ],
        },
      ],
      plugins: [],
      cache_time: 0,
      start_absolute: params[0],
      end_absolute: params[1],
    };
    return query;
  }

    @action fetchWholeCountry(date_unit, date_str, name = 'aqi') {
      this.loading = true;
      
      const query = this.buildWholeCountryQuery(date_unit, date_str, name);
      axios.post(this.url, query)
          .then((response) => {
            const list = response.data.queries[0].results;
            const sample_size = response.data.queries[0].sample_size;
            this.loading = false;
            this.initial = false;
            if (sample_size) {
              this.wholeCountryList = list.map(x => (
                { 
                  name: x.tags.city[0], 
                  value: [x.tags.longtitude[0], x.tags.latitude[0], Math.round(x.values[0][1]), x.tags.quality[0], x.tags.city[0], x.tags.position_name[0], x.tags.province[0]],
                })
              );
            } else {
              this.wholeCountryList = [];
            }
          })
          .catch((err) => {
            console.log(err);
          });
    }

    @action fetchProvinceList(date_unit, date_str, name = 'aqi') {
      this.loading = true;
      
      const query = this.buildProvinceListQuery(date_unit, date_str, name);
      axios.post(this.url, query)
          .then((response) => {
            const list = response.data.queries[0].results;
            const sample_size = response.data.queries[0].sample_size;
            this.loading = false;
            this.initial = false;
            if (sample_size) {
              this.provinceList = list.map(x => (
                { 
                  name: x.tags.province[0].substring(0, x.tags.province[0].length - 1), 
                  value: Math.round(x.values[0][1]),
                })
              );
            } else {
              this.provinceList = [];
            }
          })
          .catch((err) => {
            console.log(err);
          });
    }

    @action fetchProvinceDetail(date_unit, date_str, name, provinceName) {
      const query = this.buildProvinceDetailQuery(date_unit, date_str, name, provinceName);
      axios.post(this.url, query)
      .then((response) => {
        const list = response.data.queries[0].results;
        const sample_size = response.data.queries[0].sample_size;
        this.loading = false;
        this.initial = false;
        if (sample_size) {
          this.provinceDetail = list.map(x => (
            { 
              name: this.zxs.indexOf(provinceName) < 0 ? x.tags.city[0] : x.tags.district[0],
              value: Math.round(x.values[0][1]),
            })
          );
        } else {
          this.provinceDetail = [];
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }

  buildCityDetailQuery(date_unit, start_date, end_date, name, cityName) {
    const params = this.buildQueryParamsForCity(date_unit, start_date, end_date);
    const city = cityName;
    const query = {
      metrics: [
        {
          tags: {
            city: [
              city,
            ],
          },
          name,
          aggregators: [
            {
              name: 'avg',
              sampling: {
                value: '1',
                unit: params[2],
              },
              align_start_time: true,
            },
          ],
        },
      ],
      plugins: [],
      cache_time: 0,
      start_absolute: params[0],
      end_absolute: params[1],
    };
    return query;
  }

    @action fetchCityDetail(date_unit, start_date, end_date, name, cityName, type = this.type.SINGLE) {
      const query = this.buildCityDetailQuery(date_unit, start_date, end_date, name, cityName);
      let date_format = 'YYYY-MM-DD HH';
      if (date_unit === '日') { date_format = 'YYYY-MM-DD'; } else if (date_unit === '月') { date_format = 'YYYY-MM'; }
      axios.post(this.url, query)
      .then((response) => {
        const list = response.data.queries[0].results;
        const sample_size = response.data.queries[0].sample_size;
        this.loading = false;
        this.initial = false;
        if (type === this.type.SINGLE) {
          if (sample_size) {
            this.cityDetail = list[0].values.map(x => [moment(x[0]).format(date_format), Math.round(x[1] / 10)]);
          } else {
            this.cityDetail = [];
          }
        } else if (type === this.type.CITY1) {
          if (sample_size) {
            this.cityDetail1 = list[0].values.map(x => [moment(x[0]).format(date_format), Math.round(x[1] / 10)]);
          } else {
            this.cityDetail1 = [];
          }
        } else if (type === this.type.CITY2) {
          if (sample_size) {
            this.cityDetail2 = list[0].values.map(x => [moment(x[0]).format(date_format), Math.round(x[1] / 10)]);
          } else {
            this.cityDetail2 = [];
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }


  buildCityQualityQuery(date_unit, start_date, end_date, cityName) {
    const params = this.buildQueryParamsForCity(date_unit, start_date, end_date);
    const city = cityName;
    const query = {
      metrics: [
        {
          tags: {
            city: [
              city,
            ],
          },
          name: 'aqi',
          group_by: [
            {
              name: 'tag',
              tags: [
                'quality',
              ],
            },
          ],
          aggregators: [
            {
              name: 'count',
              sampling: {
                value: params[3],
                unit: params[2],
              },
              align_start_time: true,
            },
          ],
        },
      ],
      plugins: [],
      cache_time: 0,
      start_absolute: params[0],
      end_absolute: params[1],
    };
    return query;
  }

    @action fetchCityQuality(date_unit, start_date, end_date, cityName, type = this.type.SINGLE) {
      const query = this.buildCityQualityQuery(date_unit, start_date, end_date, cityName);
      axios.post(this.url, query)
      .then((response) => {
        const list = response.data.queries[0].results;
        const sample_size = response.data.queries[0].sample_size;
        this.loading = false;
        this.initial = false;
        if (type === this.type.SINGLE) {
          if (sample_size) {
            this.cityQualityDetail = list.map(x => ({ name: x.tags.quality[0], value: x.values[0][1] }));
          } else {
            this.cityQualityDetail = [];
          }
        } else if (type === this.type.CITY1) {
          if (sample_size) {
            this.cityQualityDetail1 = list.map(x => ({ name: x.tags.quality[0], value: x.values[0][1] }));
          } else {
            this.cityQualityDetail1 = [];
          }
        } else if (type === this.type.CITY2) {
          if (sample_size) {
            this.cityQualityDetail2 = list.map(x => ({ name: x.tags.quality[0], value: x.values[0][1] }));
          } else {
            this.cityQualityDetail2 = [];
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }


    @action fetchCityRank(month) {
      const startDate = moment(month, 'YYYY-MM');
      const start = startDate.unix() * 1000;
      const end = startDate.add(startDate.daysInMonth() * 24 - 1, 'h').unix() * 1000;
      const query = {
        metrics: [
          {
            tags: {},
            name: 'aqi',
            group_by: [
              {
                name: 'tag',
                tags: [
                  'city',
                ],
              },
            ],
            aggregators: [
              {
                name: 'avg',
                sampling: {
                  value: '1',
                  unit: 'months',
                },
                align_start_time: true,
              },
            ],
          },
          {
            tags: {},
            name: 'pm25',
            group_by: [
              {
                name: 'tag',
                tags: [
                  'city',
                ],
              },
            ],
            aggregators: [
              {
                name: 'avg',
                sampling: {
                  value: '1',
                  unit: 'months',
                },
                align_start_time: true,
              },
            ],
          },
          {
            tags: {},
            name: 'pm10',
            group_by: [
              {
                name: 'tag',
                tags: [
                  'city',
                ],
              },
            ],
            aggregators: [
              {
                name: 'avg',
                sampling: {
                  value: '1',
                  unit: 'months',
                },
                align_start_time: true,
              },
            ],
          },
        ],
        plugins: [],
        cache_time: 0,
        start_absolute: start,
        end_absolute: end,
      };
      const res = {};
      axios.post(this.url, query)
      .then((response) => {
        const queries = response.data.queries;
        queries.forEach((q) => {
          q.results.forEach((result) => {
            const name = result.name;
            const city = result.tags.city[0];
            if (!res[city]) res[city] = {};
            const province = result.tags.province[0];
            const value = result.values[0][1];
            res[city][name] = Math.round(value);
            if (!res[city].province) res[city].province = province;
          });
        });
        const rank = [];
        for (const i in res) {
          rank.push({ 
            city: i, 
            province: res[i].province, 
            aqi: Math.round(res[i].aqi / 10), 
            pm25: res[i].pm25, 
            pm10: res[i].pm10, 
          });
        }
        rank.sort((a, b) => a.aqi - b.aqi);
        this.cityRank = rank.map((x, index) => ({
          key: index + 1,
          rank: index + 1,
          city: x.city, 
          province: x.province, 
          aqi: x.aqi, 
          pm25: x.pm25, 
          pm10: x.pm10, 
        }));
      });
    }

    @action fetchProvinceRank(month) {
      const startDate = moment(month, 'YYYY-MM');
      const start = startDate.unix() * 1000;
      const end = startDate.add(startDate.daysInMonth() * 24 - 1, 'h').unix() * 1000;
      const query = {
        metrics: [
          {
            tags: {},
            name: 'aqi',
            group_by: [
              {
                name: 'tag',
                tags: [
                  'province',
                ],
              },
            ],
            aggregators: [
              {
                name: 'avg',
                sampling: {
                  value: '1',
                  unit: 'months',
                },
                align_start_time: true,
              },
            ],
          },
          {
            tags: {},
            name: 'pm25',
            group_by: [
              {
                name: 'tag',
                tags: [
                  'province',
                ],
              },
            ],
            aggregators: [
              {
                name: 'avg',
                sampling: {
                  value: '1',
                  unit: 'months',
                },
                align_start_time: true,
              },
            ],
          },
          {
            tags: {},
            name: 'pm10',
            group_by: [
              {
                name: 'tag',
                tags: [
                  'province',
                ],
              },
            ],
            aggregators: [
              {
                name: 'avg',
                sampling: {
                  value: '1',
                  unit: 'months',
                },
                align_start_time: true,
              },
            ],
          },
        ],
        plugins: [],
        cache_time: 0,
        start_absolute: start,
        end_absolute: end,
      };
      const res = {};
      axios.post(this.url, query)
      .then((response) => {
        const queries = response.data.queries;
        queries.forEach((q) => {
          q.results.forEach((result) => {
            const name = result.name;
            const province = result.tags.province[0];
            if (!res[province]) res[province] = {};
            const value = result.values[0][1];
            res[province][name] = Math.round(value);
          });
        });
        const rank = [];
        for (const i in res) {
          rank.push({ 
            province: i,
            aqi: Math.round(res[i].aqi / 10), 
            pm25: res[i].pm25, 
            pm10: res[i].pm10, 
          });
        }
        rank.sort((a, b) => a.aqi - b.aqi);
        this.provinceRank = rank.map((x, index) => ({
          key: index + 1,
          rank: index + 1,
          province: x.province, 
          city_count: RegionStore.cityCount[x.province],
          aqi: x.aqi, 
          pm25: x.pm25, 
          pm10: x.pm10, 
        }));
      });
    }

}
export { BaseStore };
export default new BaseStore();
