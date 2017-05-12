import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {AuthService} from 'aurelia-auth';
import {UserService} from '~/services/user';

@inject(AuthService, Api, UserService)
export class Login {
  errors = [];
  constructor(auth, api, user) {
    this.auth = auth;
    this.api = api;
    this.user = user;
  }

  login() {
    return this.auth.login(this.email, this.password)
      .then(response => this.api.fetch('me', {include: ['country', 'shops']}))
      .then(user => this.user.save(user))
      .catch(err => {
        if (err.status === 422) {
          this.errors.push('Wrong username or password');
        }
      });
  }
}
