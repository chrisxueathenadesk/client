import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(Api, EventAggregator)
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
  constructor(api, ea) {
    this.api = api;
    ea.subscribe('filter__search', payload => {
      this.products.params.filter['name:search'] = payload;
      this.getProducts();
    });
  }

  getProducts() {
    this.api
      .fetch('products', this.products.params)
      .then(items => {
        this.products.total = items.total;
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

  activate(params) {
    this.products.params.filter['name:search'] = params.search && params.search;
    this.products.params.filter['category_id:eq'] = params.category && Number(params.category);
    this.products.params.filter['source_id:eq'] = params.source && Number(params.source);
    this.getProducts();
    this.getCategories();
    this.getCountries();
  }
}
