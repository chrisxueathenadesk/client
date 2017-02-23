import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {Base} from './base';

@inject(HttpClient)
export class Request extends Base {
  constructor(http, id) {
    const path = `requests/${id}`;
    super(http, path);
  }
}
