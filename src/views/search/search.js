import {inject} from 'aurelia-framework';
import {Api} from '~/models/api';

@inject(Api)
export class SearchView {
  constructor(api) {
    this.api = api;
    this.search = {
      params: {
        filter: {},
        include: [],
        page: {
          size: 12,
          number: 0
        },
        sort: '-id'
      }
    };
  }

  getProducts(container) {
    this.api
      .fetch('products', container.params)
      .then(items => {
        container.data = items.results;
      })
      .catch(error => {
        container.error = error;
      });
  }

  activate(params) {
    this.search.params.filter['name:search'] = params.search;
    this.getProducts(this.search);
  }
}
