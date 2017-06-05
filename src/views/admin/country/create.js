import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {notify} from '~/services/notification';

@inject(Api)
export class CountryCreateView {
  constructor(api) {
    //TODO: Create a model for validation
    this.api = api;
  }

  create() {
    this.api.create('countries', this.country)
      .then(success => {
        notify().log('Successfully created!');
        this.country = {};
      })
      .catch(err => console.log(err));
  }
}


