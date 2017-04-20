import {inject} from 'aurelia-framework';
import {Api} from '~/models/api';

@inject(Api)
export class RequestVM {
  request = {
    params: {
      include: ['product', 'source', 'destination']
    }
  };
  constructor(api) {
    this.api = api;
  }

  activate(params) {
    this.api.fetch(`me/requests/${params.request_id}`, this.request.params)
      .then(response => {
        this.request.data = response;
      })
      .catch(err => {
        console.log(err);
      });
  }
}
