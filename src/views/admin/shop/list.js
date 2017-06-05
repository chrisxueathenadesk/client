import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';

@inject(Api)
export class ShopListView {
  shops = {
    params: {}
  }

  constructor(api) {
    this.api = api;
  }

  getShops() {
    this.api
    .fetch('shops', this.shops.params)
    .then(data => this.shops.data = data.results)
    .catch(err => console.log(err));
  }

  delete(id) {
    console.log(id);
  }

  activate() {
    this.getShops();
  }
}


