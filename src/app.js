import {inject} from 'aurelia-framework';
import {FetchConfig, AuthorizeStep} from 'aurelia-auth';
import {AuthService} from 'aurelia-auth';
import {UserService} from '~/services/user';
import {Api} from '~/models/api';

@inject(FetchConfig, AuthService, UserService, Api)
export class App {
  constructor(fetchConfig, auth, user, api) {
    this.fetchConfig = fetchConfig;
    this.auth = auth;
    this.user = user;
    this.api = api;
  }

  activate() {
    this.fetchConfig.configure();

    if (this.auth.isAuthenticated()) {
      this.api.fetch('me', {include: ['country']})
      .then(profile => {
        this.user.save(profile);
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  configureRouter(config, router) {
    config.title = 'Novelship';
    config.options.pushState = true;
    config.options.root = '/';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
      {
        route: '',
        redirect: 'home'
      },
      {
        route: 'home',
        name: 'home',
        moduleId: 'views/home/index',
        title: 'Home'
      },
      {
        route: 'deals',
        name: 'deals',
        moduleId: 'views/home/index',
        nav: true,
        title: 'Deals'
      },
      {
        route: 'categories',
        name: 'categories',
        moduleId: 'views/home/index',
        nav: true,
        title: 'Categories'
      },
      {
        route: 'shops',
        name: 'shops',
        moduleId: 'views/home/index',
        nav: true,
        title: 'Shops'
      },
      {
        route: 'product/:product_id',
        name: 'product',
        moduleId: 'views/product/index'
      },
      {
        route: 'filter',
        name: 'filter',
        moduleId: 'views/filter/index'
      },
      {
        route: 'admin',
        name: 'admin',
        moduleId: 'views/admin/index',
        title: 'Admin'
      },
      {
        route: 'user',
        name: 'user',
        moduleId: 'views/user/index',
        nav: true,
        auth: true,
        title: 'Account'
      },
      {
        route: 'auth',
        name: 'auth',
        auth: false,
        nav: true,
        moduleId: 'views/login/index',
        title: 'Login'
      }
    ]);

    this.router = router;
  }
}

