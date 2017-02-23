import {inject} from 'aurelia-framework';
import {Api} from '~/models/api';

@inject(Api)
export class RequestsView {
  constructor(api) {
    this.api = api;
    this.requests = {};
  }

  activate() {
    this.api
      .fetch('me/requests')
      .then(requests => {
        this.requests.data = requests.results;
      })
      .catch(err => {
        this.requests.error = err;
      });
  }
}

