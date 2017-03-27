import {inject} from 'aurelia-framework';
import {Api} from '~/models/api';

@inject(Api)
export class CreateProduct {
  constructor(api) {
    this.api = api;
    this.product = {};
  }

  activate(params) {
    this.product.shop_id = Number(params.shop_id);
  }

  create() {
    this.api.create(`me/shops/${this.product.shop_id}/products`, this.product)
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.log(err);
    });
  }
}
