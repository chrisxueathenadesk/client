import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Api} from '~/models/api';
import {UserService} from '~/services/user';
import {AuthService} from 'aurelia-auth';

@inject(Api, Router, UserService, AuthService)
export class DashboardView {
  requests = {
    params: {
      include: ['product']
    }
  };
  shops = {};
  constructor(api, router, userStore, auth) {
    this.api = api;
    this.router = router;
    this.user = userStore.user;
    this.auth = auth;
  }

  activate() {
    this.api
      .fetch('me/requests', this.requests.params)
      .then(requests => {
        this.requests.data = requests.results;
      })
      .catch(err => {
        this.requests.error = err;
      });

    this.api
      .fetch('me/shops')
      .then(shops => {
        this.shops.data = shops.results;
      })
      .catch(err => {
        this.shops.error = err;
      });
  }
}

