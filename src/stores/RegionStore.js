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


  constructor() {
    this.fetchRegionList();
    this.regionList = [];
    this.cityNumber = {};
  }
  
    @computed get ready() {
      return !this.initial && !this.loading;
    }

  get regions() {
    if (this.regionList.length > 0) { return this.regionList; }
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
      this.regionList.push({
        label: item.name,
        value: item.name,
        center: [item.center.longitude, item.center.latitude],
        children,
      });
    }
    return this.regionList;
  }

  get cityCount() {
    if (Object.keys(this.cityNumber).length > 0) return this.cityNumber;
    const regions = this.regions;
    regions.forEach((x) => {
      this.cityNumber[x.label] = x.children.length;
    });
    return this.cityNumber;
  }

    @action fetchRegionList(payload = {}) {
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
