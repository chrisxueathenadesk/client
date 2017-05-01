import {inject} from 'aurelia-framework';
import {Api} from '~/models/api';

@inject(Api)
export class FilterView {
  errors = {};
  products = {
    params: {
      filter: {},
      include: ['source', 'shop'],
      page: {
        size: 12,
        number: 0
      },
      sort: '-id'
    }
  };
  constructor(api) {
    this.api = api;
  }

  getProducts() {
    this.api
      .fetch('products', this.products.params)
      .then(items => {
        this.products.data = items.results;
      })
      .catch(error => {
        this.products.error = error;
      });
  }

  getCategories() {
    this.api
      .fetch('categories')
      .then(data => {
        this.categories = data.results;
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

  getCountries() {
    this.api
      .fetch('countries')
      .then(data => {
        this.countries = data.results;
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

  // processParams() {
  //   this.products.params
  // }

  activate(params) {
    if (this.products.params) {
      this.products.params.filter['name:search'] = params.search;
    }
    this.getProducts();
    this.getCategories();
    this.getCountries();
  }
}
