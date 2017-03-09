import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class OrderDialog {
  constructor(controller) {
    this.controller = controller;
  }

  activate(model) {
    this.request = model.request;
    this.product = model.product;
  }
}
