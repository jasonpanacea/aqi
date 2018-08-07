import axios from 'axios';
import moment from 'moment';

import {
    observable,
    computed,
    action,
  } from 'mobx';
  
class BaseStore {
    @observable initial = true;
    @observable loading = false;

    @observable wholeCountryList = [];
    @observable provinceList = [];
  
    @computed get ready() {
      return !this.initial && !this.loading;
    }

  get url() {
    return 'http://127.0.0.1:8080/api/v1/datapoints/query';
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
                  value: [x.tags.longtitude[0], x.tags.latitude[0], Math.round(x.values[0][1]), x.tags.quality[0], x.tags.city[0], x.tags.position_name[0]],
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
}
export { BaseStore };
export default new BaseStore();
