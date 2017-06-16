import {Api} from '~/services/api';
import {inject} from 'aurelia-framework';

@inject(Api)
export class ShopProductListVM {
  shop = {};
  products = {
    params: {
      filter: {},
      page: {
        size: 10,
        number: 0
      }
    }
  };
  countries = {};
  categories = {};
  constructor(api) {
    this.api = api;
  }

  getProducts() {
    this.api.fetch(`me/shops/${this.params.shop_id}/products`, this.products.params)
      .then(products => {
        this.products.data = products.results;
        this.products.total = products.total;
      })
      .catch(err => console.log(err));
  }

  activate(params) {
    this.params = params;
    this.getProducts();

    this.api.fetch(`me/shops/${params.shop_id}`)
      .then(shop => this.shop.data = shop)
      .catch(err => console.log(err));

    this.api
      .fetch('countries')
      .then(data => this.countries.data = data.results)
      .catch(err => console.log(err));

    this.api
      .fetch('categories')
      .then(data => this.categories.data = data.results)
      .catch(err => console.log(err));
  }
}

