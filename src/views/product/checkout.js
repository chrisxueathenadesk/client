import {inject} from 'aurelia-framework';
import {Api} from '~/models/api';
import {UserService} from '../../services/user';
import {Payment} from '../../services/payment';
import {Router} from 'aurelia-router';

@inject(Router, Api, UserService, Payment)
export class CheckoutVM {
  error = {};
  request = {};
  constructor(router, api, user, payment) {
    this.router = router;
    this.api = api;
    this.user = user.user;
    this.payment = payment;
  }

  getProduct(id, selections) {
    this.api
      .fetch(`products/${id}`)
      .then(product => {
        this.product = product;
        this.request = {
          source_id: product.source_id,
          base_price: product.price,
          destination_id: this.user.country_id,
          shipping_address: this.user.address
        };
        this.selectOptions(selections);
        this.getPrice();
      })
      .catch(error => {
        this.error.product = error;
      });
  }

  save(token) {
    this.inflight = true;
    this.payment.saveCard(token)
      .then(response => {
        // charge the user
        console.log('successfully saved card');
        const currency = 'SGD';
        return this.payment.charge(this.request.total_price, currency);
      })
      .then(response => {
        console.log('successfully charged card');
        this.request.stripe_charge_id = response.id;
        return this.createOrder(this.request);
      })
      .then(response => {
        // redirect to payment confirmation page
        this.router.navigateToRoute('acknowledge');
        console.log(response);
      })
      .catch(error => {
        this.inflight = false;
        // send error to admin
        console.log(error);
      });
  }

  charge() {
    this.payment
      .charge(this.request.total_price)
      .then(response => {
        this.request.charge_id = response.id;
        return this.createOrder(this.request);
      })
      .then(response => {
        // redirect to payment confirmation page
        console.log(response);
      })
      .catch(error => {
        // send error to admin
        console.log(error);
      });
  }

  createOrder(request) {
    return this.api
      .create(`products/${this.product_id}/requests`, request);
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
