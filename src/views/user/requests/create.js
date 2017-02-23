import {inject} from 'aurelia-framework';
import {Api} from '~/models/api';

@inject(Api)
export class CreateRequest {
  constructor(api) {
    this.api = api;
    this.countries = {};
    this.request = {};
  }

  fetchCountries() {
    this.api
    .fetch('countries')
    .then(countries => {
      this.countries.data = countries.results;
    })
    .catch(err => {
      this.countries.error = err;
    });
  }

  create() {
    this.api.create('me/requests', this.request)
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.log(err);
    });
  }

  activate() {
    this.fetchCountries();
  }
}

