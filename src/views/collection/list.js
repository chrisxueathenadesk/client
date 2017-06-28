import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';

@inject(Api)
export class CollectionsView {
  collections = {
    params: {}
  }
  constructor(api) {
    this.api = api;
  }

  activate() {
    this.api
      .fetch('collections')
      .then(collections => this.collections.data = collections.results)
      .catch(err => this.collections.error = err);
  }
}
