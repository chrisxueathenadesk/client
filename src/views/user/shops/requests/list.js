import {inject} from 'aurelia-framework';
import {Api} from '~/models/api';

@inject(Api)
export class ShopRequestListVM {
  requests = {
    params: {
      include: ['product', 'customer']
    }
  }
  constructor(api) {
    this.api = api;
  }

  activate(params) {
    this.api.fetch(`me/shops/${params.shop_id}/requests`, this.requests.params)
      .then(requests => this.requests.data = requests.results)
      .catch(err => console.log(err));
  }
}
