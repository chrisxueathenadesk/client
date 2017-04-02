import {HttpClient} from 'aurelia-fetch-client';

export class ExternalHttp extends HttpClient {
  constructor() {
    super();
    this.configure(config => config);
  }
}
