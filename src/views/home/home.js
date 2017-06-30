import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {PriceService} from '~/services/price';

@inject(Api)
export class HomeView {
  countries = {};
  categories = {};
  announcements = {};
  collections = {};

  constructor(api, router) {
    this.api = api;

    this.popular = {
      params: {
        filter: {
          'order_count:gt': 0
        },
        include: ['source'],
        sort: '-order_count',
        page: {
          size: 12,
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
    this.getCollections();
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

  getCollections() {
    this.api
      .fetch('collections', {page: {size: 4, number: 0}})
      .then(response => {
        this.collections.data = response.results;
      })
      .catch(error => {
        console.log(error);
        this.collections.error = error;
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
        container.data = response.results.map(product => {
          product.price = PriceService.calculatePrice(product);
          return product;
        });
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
