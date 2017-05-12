import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {ExternalHttp} from '~/services/external-http';
import {notify} from '~/services/notification';

@inject(Api, ExternalHttp)
export class CreateProduct {
  counter = {
    size: 0,
    color: 0,
    edition: 0
  };
  gallery = [];
  constructor(api, http) {
    this.api = api;
    this.http = http;
    this.product = {};
  }

  activate(params) {
    this.api.fetch('countries')
    .then(countries => this.countries = countries.results)
    .catch(err => console.log(err));

    this.api.fetch('brands')
    .then(brands => this.brands = brands.results)
    .catch(err => console.log(err));

    this.api.fetch('categories')
    .then(categories => this.categories = categories.results)
    .catch(err => console.log(err));

    this.product.shop_id = Number(params.shop_id);
  }

  add(property, counter) {
    if (!this.product[property]) {
      this.product[property] = [];
    }
    this.counter[counter] = this.counter[counter] + 1;
  }

  remove(index, property, counter) {
    if (this.product[property]) {
      this.product[property].splice(index, 1);
    }

    if (this.product[property].length === 0) {
      delete this.product[property];
    }
    this.counter[counter] = this.counter[counter] - 1;
  }

  create() {
    Promise.all(this.gallery.map(file => this.getUploadUrl(file, 'product')))
    .then(data => {
      this.product.gallery = data.map(res => res.signed_request.split('?')[0]);
      return Promise.all(data.map((response, index) => {
        this.http.fetch(response.signed_request, {
          method: 'PUT',
          body: this.gallery[index]
        });
      }));
    })
    .then(response => this.api.create(`me/shops/${this.product.shop_id}/products`, this.product))
    .then(response => {
      notify().log('Successfully created!');
      this.product = {};
      this.gallery = [];
    })
    .catch(err => {
      notify().log('Product creation failed');
    });
  }

  getUploadUrl(file, type) {
    return this.api
      .fetch('upload', {file_name: file.name, folder_name: type, file_type: file.type});
  }
}
