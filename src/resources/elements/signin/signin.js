import {DialogController} from 'aurelia-dialog';
import {inject} from 'aurelia-framework';

@inject(DialogController)
export class Signin {
  person = {};

  constructor(controller) {
    this.controller = controller;
  }

  activate(person) {
    this.person = person;
  }

  login() {
    return 'hello';
  }

}
