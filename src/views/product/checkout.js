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

    this.state = {
      addcard: false
    };
  }

  activate(params) {
    this.product_id = Number(params.product_id);
    this.getProduct(params.product_id, params);
    this.api.fetch('countries')
      .then(countries => this.countries = countries.results)
      .catch(err => console.log(err));

    this.api.fetch('me/cards')
      .then(cards => this.cards = cards.data)
      .catch(err => console.log(err));
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
    this.state.inflight = true;
    this.payment.saveCard(token)
      .then(response => {
        // charge the user
        console.log('successfully saved card');
        console.log(response);
        const currency = 'SGD';
        return this.payment.charge(this.request.total_price, currency);
      })
      .then(response => {
        console.log('successfully charged card');
        console.log(response);
        this.request.stripe_charge_id = response.id;
        return this.createOrder(this.request);
      })
      .then(response => {
        // redirect to payment confirmation page
        this.router.navigateToRoute('acknowledge');
        console.log(response);
      })
      .catch(error => {
        this.state.inflight = false;
        // send error to admin
        console.log(error);
      });
  }

  charge() {
    this.state.inflight = true;
    this.payment
      .charge(this.request.total_price, 'SGD', this.card)
      .then(response => {
        this.request.charge_id = response.id;
        return this.createOrder(this.request);
      })
      .then(response => {
        // redirect to payment confirmation page
        console.log(response);
        this.router.navigateToRoute('acknowledge');
      })
      .catch(error => {
        // send error to admin
        this.state.inflight = false;
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
}
