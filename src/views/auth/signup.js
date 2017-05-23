import {inject, NewInstance} from 'aurelia-framework';
import {Api} from '~/services/api';
import {Signup} from '~/models/signup';
import {Router} from 'aurelia-router';
import {ValidationController} from 'aurelia-validation';
import {ValidationRenderer} from '~/services/validation-renderer';

@inject(Api, Router, NewInstance.of(ValidationController))
export class SignupView {
  signup = new Signup();
  constructor(api, router, controller) {
    this.controller = controller;
    this.api = api;
    this.router = router;
    this.controller.addRenderer(new ValidationRenderer());
  }

  submit() {
    this.controller.validate()
    .then(result => {
      if (result.valid) {
        return this.api.create('auth/signup', { email: this.signup.email, password: this.signup.password });
      } else {
        throw new Error('invalid signup');
      }
    })
    .then(response => {
      this.router.navigateToRoute('verify');
    })
    .catch(err => console.log(err));
  }
}
