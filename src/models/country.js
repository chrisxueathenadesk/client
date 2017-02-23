import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {Base} from './base';

@inject(HttpClient)
export class Country extends Base {
  constructor(http, id) {
    const path = `countries/${id}`;
    super(http, path);
  }
}
