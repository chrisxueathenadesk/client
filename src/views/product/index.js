export class ProductRouter {
  configureRouter(config, router) {
    config.map([
      {route: '', moduleId: './product'},
      {route: 'checkout', name: 'checkout', moduleId: './checkout'},
      {route: 'acknowledge', name: 'acknowledge', moduleId: './acknowledge'}
    ]);
  }
}
