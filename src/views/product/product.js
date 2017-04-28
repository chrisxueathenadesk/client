import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Api} from '~/models/api';
import {UserService} from '../../services/user';

@inject(Router, Api, UserService)
export class ProductView {
  product = {
    params: {
      include: ['source']
    }
  };
  request = {};
  selections = {};
  count = 1;

  constructor(router, api) {
    this.router = router;
    this.api = api;
  }

  getProduct(id) {
    this.api
    .fetch(`products/${id}`, this.product.params)
    .then(product => {
      this.product.data = product;
      this.request = {
        total_price: product.price
      };
    })
    .catch(error => {
      this.product.error = error;
    });
  }

  getPrice() {
    this.request.total_price = this.count * this.product.data.price + this.getDelta(this.request);
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

  getParameters(product, request) {
    const params = {};
    if (product.colors) {
      params.color = product.colors.map(color => color.name).indexOf(request.color.name);
    }
    if (product.sizes) {
      params.size = product.sizes.map(size => size.name).indexOf(request.size.name);
    }
    if (product.editions) {
      params.edition = product.editions.map(edition => edition.name).indexOf(request.edition.name);
    }
    params.count = this.count;
    return params;
  }

  confirm() {
    const selections = this.getParameters(this.product.data, this.request);
    this.router.navigateToRoute('checkout', selections);
  }

  activate(params) {
    this.getProduct(params.product_id);
  }
}
