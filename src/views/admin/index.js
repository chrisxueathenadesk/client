export class AdminRouter {
  heading = 'User';

  configureRouter(config, router) {
    config.map([
      { route: '', redirect: 'requests' },
      {route: '/requests', moduleId: './requests/index', nav: true }
    ]);
  }
}

