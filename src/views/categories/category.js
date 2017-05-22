import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';

@inject(Api)
export class CategoryView {
  products = {};

  constructor(api) {
    this.api = api;
  }

  activate(param) {
    this.api
      .fetch(`categories/${param.category_id}/products`)
      .then(products => this.products.data = products.results)
      .catch(err => this.products.error = err);
  }
}
