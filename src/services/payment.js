import {inject} from 'aurelia-framework';
import {Api} from '~/models/api';

@inject(Api)
export class Payment {
  constructor(api) {
    this.api = api;
  }

  saveCard(token) {
    return this.api.create('me/cards', {token: token})
      .then(response => response.json());
  }

  charge(amount, currency, source) {
    return this.api.create('me/charge', {amount, currency, source})
      .then(response => response.json());
  }
}
