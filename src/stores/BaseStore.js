import axios from 'axios';
import {
    observable,
    computed,
    action,
  } from 'mobx';
  
class BaseStore {
    @observable initial = true;
    @observable loading = false;

    @observable list = [];
    @observable detail = {};
  
    @computed get ready() {
      return !this.initial && !this.loading;
    }

    @computed get data() {
      const res = [];
      for (let i = 0; i < this.list.length; i += 1) {
        const item = this.list[i];
        res.push({
          name: item.city,
          value: [item.longitude, item.latitude, item.aqi, item.quality, item.city, item.position_name],
        });
      }
      return res;
    }

    @action fetchList(payload = {}) {
      this.loading = true;
      axios.get('/data.json', payload)
          .then((response) => {
            this.detail = response.data;
            this.list = response.data.rows;
            this.loading = false;
            this.initial = false;
          })
          .catch((err) => {
            console.log(err);
          });
    }
}
export { BaseStore };
export default new BaseStore();
