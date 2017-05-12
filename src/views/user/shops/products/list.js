import {Api} from '~/services/api';
import {inject} from 'aurelia-framework';

@inject(Api)
export class ShopProductListVM {
  shop = {};
  products = {};
  constructor(api) {
    this.api = api;
  }

  activate(params) {
    this.api.fetch(`me/shops/${params.shop_id}`)
      .then(shop => this.shop.data = shop)
      .catch(err => console.log(err));

    this.api.fetch(`me/shops/${params.shop_id}/products`)
      .then(products => this.products.data = products.results)
      .catch(err => console.log(err));
  }
  // two navs trips and requests
}

