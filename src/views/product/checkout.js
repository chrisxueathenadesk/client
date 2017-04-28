import {inject} from 'aurelia-framework';
import {Api} from '~/models/api';
import {UserService} from '../../services/user';
import {Payment} from '../../services/payment';
import {Router} from 'aurelia-router';

@inject(Router, Api, UserService, Payment)
export class CheckoutVM {
  error = {};
  request = {
    shipping_address: {}
  };
  companyAddress = {
    line_1: '195 Pearl’s Hill Terrace',
    line_2: '#02-03A',
    zip: 'S168976',
    city: 'Singapore'
  };
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
    this.getProduct(Number(params.product_id), params);
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
          collection_method: 'pickup',
          count: Number(selections.count),
          shipping_address: this.companyAddress || {}
        };
        this.selectOptions(selections);
        this.getPrice();
      })
      .catch(error => {
        this.error.product = error;
      });
  }

  // TODO: consolidate charge and save
  charge() {
    this.state.inflight = true;
    this.saveAddress(this.request.shipping_address);
    this.saveCountry(this.request.destination_id);
    this.payment
      .charge(this.request.total_price, 'SGD', this.card)
      .then(response => {
        this.request.stripe_charge_id = response.id;
        return this.api.create(`products/${this.product.id}/requests`, this.request);
      })
      .then(() => {
        return this.api.edit(`products/${this.product.id}`, {order_count: this.product.order_count ? this.product.order_count + 1 : 1});
      })
      .then(response => {
        this.router.navigateToRoute('acknowledge');
      })
      .catch(error => {
        // send error to admin
        this.state.inflight = false;
        console.log(error);
      });
  }

  save(token) {
    this.state.inflight = true;
    this.saveAddress(this.request.shipping_address);
    this.saveCountry(this.request.destination_id);
    this.payment.saveCard(token)
      .then(response => {
        const currency = 'SGD';
        return this.payment.charge(this.request.total_price, currency);
      })
      .then(response => {
        this.request.stripe_charge_id = response.id;
        return this.api.create(`products/${this.product.id}/requests`, this.request);
      })
      .then(() => {
        return this.api.edit(`products/${this.product.id}`, {order_count: this.product.order_count ? this.product.order_count + 1 : 1});
      })
      .then(response => {
        // redirect to payment confirmation page
        this.router.navigateToRoute('acknowledge');
      })
      .catch(error => {
        this.state.inflight = false;
        // send error to admin
        console.log(error);
      });
  }

  saveAddress(address) {
    if (!this.user.address) {
      this.user.address = address;
      this.api.edit('me', { address: address })
        .then(success => console.log(success));
    }
  }

  saveCountry(countryId) {
    if (!this.user.country_id) {
      this.user.country_id = countryId;
      this.api.edit('me', { country_id: countryId })
        .then(success => console.log(success));
    }
  }

  toggleAddress() {
    if (this.request.collection_method === 'pickup') {
      this.request.shipping_address = this.companyAddress;
    } else {
      this.request.shipping_address = this.user.address;
    }
  }

  selectOptions(selections) {
    if (selections.color) this.request.color = this.product.colors[selections.color];
    if (selections.size) this.request.size = this.product.sizes[selections.size];
    if (selections.edition) this.request.edition = this.product.editions[selections.edition];
  }

  getPrice() {
    this.request.total_price = this.request.count * (this.product.price + this.getDelta(this.request));
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
