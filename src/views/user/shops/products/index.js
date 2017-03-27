export class ProductsRouter {
  heading = 'Products';

  configureRouter(config, router) {
    config.map([
      { route: '', redirect: 'list' },
      { route: '/list', name: 'list', moduleId: './list/list', nav: true, title: 'List' },
      { route: '/:product_id/edit', moduleId: './edit/edit' },
      { route: '/:product_id/details', moduleId: './edit/edit' },
      { route: '/create', moduleId: './create/create' }
    ]);
  }
}

