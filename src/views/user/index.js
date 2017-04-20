export class UserRouter {
  heading = 'User';

  configureRouter(config, router) {
    config.map([
      {route: '', moduleId: './dashboard'},
      {route: 'trips', moduleId: './trips/index'},
      {route: 'requests', moduleId: './requests/index'},
      {route: 'shops/:shop_id', moduleId: './shops/index'}
    ]);
  }
}

