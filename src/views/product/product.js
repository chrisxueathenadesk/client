import {inject} from 'aurelia-framework';
import {Api} from '~/models/api';
import {DialogService} from 'aurelia-dialog';
import {OrderDialog} from './order-dialog';
import {UserService} from '../../services/user';

@inject(Api, DialogService, UserService)
export class ProductView {
  constructor(api, dialog, currentUser) {
    this.api = api;
    this.dialog = dialog;
    this.currentUser = currentUser;
    this.product = {
      params: {
        include: ['source']
      }
    };
    this.request = {};
  }

  getProduct(id) {
    this.api
    .fetch(`products/${id}`, this.product.params)
    .then(product => {
      this.product.data = product;
      this.request = {
        source_id: product.source_id,
        destination_id: this.currentUser.user.country_id,
        product_id: product.id,
        base_price: product.price,
        total_price: 5 + (product.price + product.price * 0.1)
      };
    })
    .catch(error => {
      this.product.error = error;
    });
  }

  confirm() {
    const model = {
      product: this.product.data,
      request: this.request
    };
    this.dialog.open({ viewModel: OrderDialog, model: model}).then(response => {
      if (!response.wasCancelled) {
        this.request.status = 'confirmed';
        this.api
        .create('requests', this.request)
        .then(success => console.log(success))
        .catch(error => console.log(error));
      } else {
        console.log('bad');
      }
      console.log(response.output);
    });
  }

  activate(params) {
    this.getProduct(params.product_id);
  }
}
