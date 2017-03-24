import {inject} from 'aurelia-framework';
import {Api} from '~/models/api';
import {Router} from 'aurelia-router';

@inject(Api, Router)
export class Signup {
  user = {};
  signup = {};
  constructor(api, router) {
    this.api = api;
    this.router = router;
  }

  login(user) {
    this.api.create('auth/signup', { email: user.email, password: user.password })
      .then(response => {
        this.router.navigateToRoute('verify');
      })
      .catch(err => console.log(err));
  }
}
