export class ShopRouter {
  heading = 'Shop';

  configureRouter(config, router) {
    config.map([
      { route: '', redirect: 'list' },
      { route: 'list', name: 'list', moduleId: './list', title: 'List' },
      { route: ':shop_id/products', name: 'shop_products', moduleId: './products/index', title: 'Products' },
      { route: ':shop_id/requests', name: 'shop_requests', moduleId: './requests/index' }
    ]);
  }
}

