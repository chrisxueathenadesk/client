import {inject} from 'aurelia-framework';
import {Api} from '~/models/api';
import {UserService} from '../../services/user';

@inject(Api, UserService)
export class CheckoutVM {
  error = {};
  request = {};
  constructor(api, user) {
    this.api = api;
    this.user = user;
  }

  getProduct(id, selections) {
    this.api
    .fetch(`products/${id}`)
    .then(product => {
      this.product = product;
      this.request = {
        source_id: product.source_id,
        base_price: product.price,
        destination_id: this.user.user.country_id,
        shipping_address: this.user.user.address
      };
      this.selectOptions(selections);
      this.getPrice();
    })
    .catch(error => {
      this.error.product = error;
    });
  }

  create() {
    this.api
      .create(`products/${this.product_id}/requests`, this.request)
      .then(success => {
        console.log(success);
      })
      .catch(err => {
        console.log(err);
      });
  }

  selectOptions(selections) {
    if (selections.color) this.request.color = this.product.colors[selections.color];
    if (selections.size) this.request.size = this.product.sizes[selections.size];
    if (selections.edition) this.request.edition = this.product.editions[selections.edition];
  }

  getPrice() {
    this.request.total_price = this.product.price + this.getDelta(this.request);
  }

  getDelta(request) {
    let delta = 0;
    if (request.size && request.size.delta) {
      delta = delta + request.size.delta;
    }
    if (request.color && request.color.delta) {
      delta = delta + request.color.delta;
    }
    if (request.edition && request.edition.delta) {
      delta = delta + request.edition.delta;
    }
    return delta;
  }

  activate(params) {
    this.product_id = Number(params.product_id);
    this.getProduct(params.product_id, params);
  }
}
