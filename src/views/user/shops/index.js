export class ShopRouter {
  heading = 'Shop';

  configureRouter(config, router) {
    config.map([
      { route: '', redirect: 'products'},
      { route: 'products', name: 'shopProducts', moduleId: './products/index', title: 'Products' },
      { route: 'requests', name: 'shopRequests', moduleId: './requests/index' }
    ]);
  }
}

