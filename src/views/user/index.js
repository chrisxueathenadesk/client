export class UserRouter {
  heading = 'User';

  configureRouter(config, router) {
    config.map([
      { route: '', redirect: 'requests' },
      {route: 'trips', moduleId: './trips/index', nav: true, title: 'Trips'},
      {route: 'requests', moduleId: './requests/index', nav: true },
      {route: 'shops', moduleId: './shops/index', nav: true }
    ]);
  }
}

