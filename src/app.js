import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {FetchConfig, AuthorizeStep} from 'aurelia-auth';
import {AuthService} from 'aurelia-auth';
import {UserService} from '~/services/user';

@inject(Router, FetchConfig, AuthService, UserService)
export class App {
  constructor(router, fetchConfig, auth, user) {
    this.fetchConfig = fetchConfig;
    this.auth = auth;
    this.user = user;
  }

  activate() {
    this.fetchConfig.configure();

    if (this.auth.isAuthenticated()) {
      this.auth.getMe()
      .then(profile => {
        this.user.save(profile);
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  configureRouter(config, router) {
    config.title = 'Rad Ship';
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
        nav: true,
        title: 'Home'
      },
      {
        route: 'requests',
        name: 'requests',
        moduleId: 'views/requests/index',
        nav: true,
        title: 'Requests'
      },
      {
        route: 'user',
        name: 'user',
        moduleId: 'views/user/index',
        nav: true,
        auth: true,
        title: 'Dashboard'
      },
      {
        route: 'auth',
        name: 'auth',
        moduleId: 'views/login/index',
        title: 'Login'
      }
    ]);

    this.router = router;
  }
}

