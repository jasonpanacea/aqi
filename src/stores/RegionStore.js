import axios from 'axios';
import {
    observable,
    computed,
    action,
  } from 'mobx';
  
class RegionStore {
    @observable initial = true;
    @observable loading = false;

    @observable list = [];
  
    @computed get ready() {
      return !this.initial && !this.loading;
    }

    @computed get regions() {
      const res = [];
      for (let i = 0; i < this.list.length; i++) {
        const item = this.list[i];
        const children = [];
        if (item.districts) {
          for (let j = 0; j < item.districts.length; j++) {
            if (item.districts[j].center.latitude && item.districts[j].center.longitude) {
              children.push({
                label: item.districts[j].name,
                value: item.districts[j].name,
                center: [item.districts[j].center.longitude, item.districts[j].center.latitude],
              });
            }
          }
        }
        res.push({
          label: item.name,
          value: item.name,
          center: [item.center.longitude, item.center.latitude],
          children,
        });
      }
      return res;
    }

    @action fetchList(payload = {}) {
      this.loading = true;
      axios.get('/region.json', payload)
          .then((response) => {
            this.list = response.data.districts;
            this.loading = false;
            this.initial = false;
          })
          .catch((err) => {
            console.log(err);
          });
    }
}
export { RegionStore };
export default new RegionStore();
