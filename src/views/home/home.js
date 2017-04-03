import {inject} from 'aurelia-framework';
import {Api} from '~/models/api';

@inject(Api)
export class HomeView {
  commonParameters = {
    page: {
      size: 6,
      number: 0
    }
  };

  constructor(api) {
    this.api = api;
    this.countries = {};
    const today = new Date();
    const lastMonth = new Date((new Date()).setDate(today.getDate() - 30));

    this.featured = {
      params: {
        filter: {
          'featured:eq': true
        },
        sort: '-id'
      }
    };

    this.popular = {
      params: {
        filter: {
          'active:eq': true,
          'created_at:gt': lastMonth.toISOString()
        }
      }
    };

    this.latest = {
      params: {
        filter: {
          'active:eq': true
        },
        sort: '-id'
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
