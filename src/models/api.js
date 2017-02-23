import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {buildQueryString} from 'aurelia-path';

@inject(HttpClient)
export class Api {
  constructor(http) {
    this.http = http;
  }

  static formatFilters(filterObj) {
    const formattedFilter = {};
    Object.keys(filterObj).forEach(key => {
      formattedFilter[`where[${key}]`] = filterObj[key];
    });
    return formattedFilter;
  }

  _getQuery(path, params) {
    if (!params) {
      return path;
    }

    let query = path + '?';

    if (params.filter && Object.keys(params.filter).length) {
      query = `${query}${buildQueryString(Api.formatFilters(params.filter, 'where'))}`;
    }

    if (params.include.length) {
      let includeQuery = {include: `[${params.include.join(',')}]`};
      query = `${query}&${buildQueryString(includeQuery)}`;
    }

    if (params.page) {
      query = `${query}&page[number]=${params.page.number}&page[size]=${params.page.size}`;
    }

    if (params.sort) {
      query = `${query}&sort=${params.sort}`;
    }

    return query;
  }

  fetch(path, params) {
    return this.http
      .fetch(this._getQuery(path, params))
      .then(response => response.json());
  }

  create(path, body) {
    return this.http
      .fetch(path, {
        method: 'POST',
        body: json(body)
      })
      .then(response => response.json());
  }
}
