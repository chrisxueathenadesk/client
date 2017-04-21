export class ShopRouter {
  heading = 'Shop';

  configureRouter(config, router) {
    config.map([
      { route: '', redirect: 'products'},
      { route: 'products', name: 'shopProducts', moduleId: './products/index', nav: true, title: 'Products' },
      { route: 'requests', name: 'shopRequests', moduleId: './requests/index', nav: true, title: 'Orders' }
    ]);

    this.router = router;
  }
}

