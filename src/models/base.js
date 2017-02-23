import {json} from 'aurelia-fetch-client';
import {buildQueryString} from 'aurelia-path';

export class Base {
  constructor(http, path) {
    this.path = path;
    this.http = http;
  }

  retrieve(include) {
    let query = this.path;
    if (include && include.length) {
      let includeQuery = {include: `[${include.join(',')}]`};
      query = `${query}&${buildQueryString(includeQuery)}`;
    }
    return this.http.fetch(query)
      .then(response => response.json());
  }

  update(body) {
    return this.http.fetch(this.path, {
      method: 'PUT',
      body: json(body)
    })
      .then(response => response.json());
  }

  destroy() {
    return this.http.fetch(this.path, {
      method: 'DELETE'
    })
      .then(response => response.json());
  }
}

