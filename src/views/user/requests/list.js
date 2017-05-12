import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';

@inject(Api)
export class RequestListVM {
  requests = {
    params: {
      include: ['product']
    }
  }
  constructor(api) {
    this.api = api;
  }

  activate(params) {
    this.api.fetch('me/requests', this.requests.params)
      .then(requests => this.requests.data = requests.results)
      .catch(err => console.log(err));
  }
}
