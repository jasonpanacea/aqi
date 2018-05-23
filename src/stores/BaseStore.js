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

    @action fetchList(payload = {}) {
      this.loading = true;
      axios.get('/data.json', payload)
          .then((response) => {
            this.detail = response.data;
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
