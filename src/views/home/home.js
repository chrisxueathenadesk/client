import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';

@inject(Api)
export class HomeView {
  commonParameters = {
    page: {
      size: 12,
      number: 0
    }
  };
  countries = {};

  constructor(api, router) {
    this.api = api;

    this.featured = {
      params: {
        filter: {
          'featured:eq': true
        },
        include: ['source'],
        sort: '-id'
      }
    };

    // popular over a period of time?
    this.popular = {
      params: {
        filter: {
          'active:eq': true,
          'order_count:gt': 0
        },
        include: ['source'],
        sort: '-order_count'
      }
    };

    this.latest = {
      params: {
        filter: {
          'active:eq': true
        },
        include: ['source'],
        sort: '-created_at'
      }
    };
  }

  getProducts(container) {
    this.api
      .fetch('products', container.params)
      .then(response => {
        container.data = response.results;
      })
      .catch(error => {
        container.error = error;
      });
  }

  getCountries() {
    this.api
      .fetch('countries')
      .then(response => {
        this.countries.data = response.results;
      })
      .catch(error => {
        this.countries.error = error;
      });
  }

  activate() {
    this.getProducts(this.featured);
    this.getProducts(this.popular);
    this.getProducts(this.latest);
    this.getCountries();
  }
}
