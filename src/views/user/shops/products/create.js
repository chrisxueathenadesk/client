import {inject, NewInstance} from 'aurelia-framework';
import {Api} from '~/services/api';
import {ExternalHttp} from '~/services/external-http';
import {notify} from '~/services/notification';
import {ValidationController} from 'aurelia-validation';
import {ValidationRenderer} from '~/services/validation-renderer';
import {Product} from '~/models/product';

@inject(Api, ExternalHttp, NewInstance.of(ValidationController))
export class CreateProduct {
  counter = {
    size: 0,
    color: 0,
    edition: 0
  };
  gallery = [];
  status = {};
  product = new Product();
  constructor(api, http, controller) {
    this.controller = controller;
    this.api = api;
    this.http = http;
    this.controller.addRenderer(new ValidationRenderer());
  }

  activate(params) {
    this.api
      .fetch('countries')
      .then(countries => this.countries = countries.results)
      .catch(err => console.log(err));

    this.api
      .fetch('brands', {page: {size: 100}, sort: 'name'})
      .then(brands => this.brands = brands.results)
      .catch(err => console.log(err));

    this.api
      .fetch('categories', {page: {size: 100}, sort: 'name'})
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
    this.controller.validate()
      .then(result => {
        if (result.valid) {
          this.status.inprogress = true;
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
              this.status.inprogress = false;
              notify().log('Successfully created!');
              this.product = {};
              this.gallery = [];
            })
          .catch(err => {
            this.status.inprogress = false;
            notify().log('Product creation failed');
          });
        } else {
          throw new Error('invalid product');
        }
      });
  }

  getUploadUrl(file, type) {
    return this.api
      .fetch('upload', {file_name: file.name, folder_name: type, file_type: file.type});
  }
}
