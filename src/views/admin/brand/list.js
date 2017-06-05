import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';

@inject(Api)
export class BrandListView {
  brands = {
    params: {}
  }

  constructor(api) {
    this.api = api;
  }

  getBrands() {
    this.api
    .fetch('brands', this.brands.params)
    .then(data => this.brands.data = data.results)
    .catch(err => console.log(err));
  }

  delete(id) {
    console.log(id);
  }

  activate() {
    this.getBrands();
  }
}

