import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {constants} from '~/services/constants';

@inject(Api)
export class ShopRequestListVM {
  requests = {
    params: {
      include: ['product', 'customer'],
      filter: {
        'status:eq': 'pending'
      }
    }
  }
  shop = {};
  products = {};
  constructor(api) {
    this.api = api;
    this.statuses = constants.requestStatus;
  }

  getOrders() {
    this.api.fetch(`me/shops/${this.params.shop_id}/requests`, this.requests.params)
      .then(requests => this.requests.data = requests.results)
      .catch(err => console.log(err));
  }

  activate(params) {
    this.params = params;
    this.getOrders();
    this.api.fetch(`me/shops/${params.shop_id}`)
      .then(shop => this.shop.data = shop)
      .catch(err => console.log(err));
    this.api.fetch(`me/shops/${params.shop_id}/products`)
      .then(products => this.products.data = products.results)
      .catch(err => console.log(err));
  }
}
