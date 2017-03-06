import {inject} from 'aurelia-framework';
import {Api} from '~/models/api';

@inject(Api)
export class ProductView {
  constructor(api) {
    this.api = api;
    this.product = {
      params: {
        include: []
      }
    };
  }

  getProduct(id) {
    this.api
    .fetch(`products/${id}`)
    .then(product => {
      this.product.data = product;
    })
    .catch(error => {
      this.product.error = error;
    });
  }

  activate(params) {
    this.getProduct(params.product_id);
  }
}
