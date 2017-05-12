import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';

@inject(Api)
export class ShopRequestVM {
  request = {
    params: {
      include: ['product', 'source', 'destination', 'customer']
    }
  };
  constructor(api) {
    this.api = api;
  }

  activate(params) {
    this.api.fetch(`me/shops/${params.shop_id}/requests/${params.request_id}`, this.request.params)
      .then(response => {
        this.request.data = response;
      })
      .catch(err => {
        console.log(err);
      });
  }
}
