import {inject} from 'aurelia-framework';
import {Api} from '~/models/api';

@inject(Api)
export class Payment {
  constructor(api) {
    this.api = api;
  }

  saveCard(token) {
    return this.api.create('me/cards', {token: token});
  }

  charge(amount, currency) {
    return this.api.create('me/charge', {amount, currency});
  }
}
