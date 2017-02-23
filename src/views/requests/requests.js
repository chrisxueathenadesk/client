import {inject} from 'aurelia-framework';
import {Api} from '~/models/api';

@inject(Api)
export class RequestView {
  constructor(api) {
    this.api = api;
    this.requests = {
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
    this.countries = {};
  }

  getRequests(params) {
    // console.log(params);
    this.api
      .fetch('requests', params)
      .then(items => {
        this.requests.data = items.results;
      })
      .catch(error => {
        this.requests.error = error;
      });
  }

  getCountries() {
    this.api
      .fetch('countries')
      .then(items => {
        this.countries.data = items.results;
      })
      .catch(error => {
        this.countries.error = error;
      });
  }

  activate() {
    this.getRequests(this.requests.params);
    this.getCountries();
  }
}
