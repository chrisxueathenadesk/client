export class ProductsRouter {
  heading = 'Products';

  configureRouter(config, router) {
    config.map([
      { route: '', redirect: 'list' },
      { route: 'list', name: 'shopProductList', moduleId: './list', title: 'List' },
      { route: ':product_id/edit', name: 'shopProductEdit', moduleId: './edit' },
      { route: 'create', name: 'shopProductCreate', moduleId: './create' }
    ]);
  }
}

