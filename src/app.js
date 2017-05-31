import {inject} from 'aurelia-framework';
import {FetchConfig, AuthorizeStep} from 'aurelia-auth';
import {AuthService} from 'aurelia-auth';
import {UserService} from '~/services/user';
import {Api} from '~/services/api';
import {ValidationRules} from 'aurelia-validation';
import {customRules} from '~/services/validation-rules';

@inject(FetchConfig, AuthService, UserService, Api)
export class App {
  constructor(fetchConfig, auth, user, api) {
    this.fetchConfig = fetchConfig;
    this.auth = auth;
    this.user = user;
    this.api = api;

    ValidationRules.customRule(...customRules.numberRange);
  }

  activate() {
    this.fetchConfig.configure();

    if (this.auth.isAuthenticated()) {
      this.api.fetch('me', {include: ['country', 'shops']})
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
        route: 'categories',
        name: 'categories',
        moduleId: 'views/categories/index',
        title: 'Categories'
      },
      {
        route: 'products/:product_id',
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
        moduleId: 'views/auth/index',
        title: 'Login'
      }
    ]);

    this.router = router;
  }
}

