import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Api} from '~/models/api';
import {UserService} from '~/services/user';

@inject(Api, Router, UserService)
export class DashboardView {
  requests = {
    params: {
      include: ['product']
    }
  };
  shops = {};
  constructor(api, router, userStore) {
    this.api = api;
    this.router = router;
    this.user = userStore.user;
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

