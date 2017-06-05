import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';

@inject(Api)
export class CountryListView {
  countries = {
    params: {}
  }

  constructor(api) {
    this.api = api;
  }

  getCountries() {
    this.api
    .fetch('countries', this.countries.params)
    .then(data => this.countries.data = data.results)
    .catch(err => console.log(err));
  }

  delete(id) {
    console.log(id);
  }

  activate() {
    this.getCountries();
  }
}


