import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';

@inject(Api)
export class HomeView {
  countries = {};
  categories = {};
  announcements = {};

  constructor(api, router) {
    this.api = api;

    this.popular = {
      params: {
        filter: {
          'active:eq': true,
          'order_count:gt': 0
        },
        include: ['source'],
        sort: '-order_count',
        page: {
          size: 6,
          number: 0
        }
      }
    };
  }

  activate() {
    this.getProducts(this.popular);
    this.getCountries();
    this.getCategories();
    this.getAnnouncements();
  }

  getCategories() {
    this.api
      .fetch('categories')
      .then(response => {
        this.categories.data = response.results;
      })
      .catch(error => {
        console.log(error);
        this.categories.error = error;
      });
  }

  getAnnouncements() {
    this.api
      .fetch('announcements')
      .then(response => {
        this.announcements.data = response.results;
      })
      .catch(error => {
        console.log(error);
        container.error = error;
      });
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
}
