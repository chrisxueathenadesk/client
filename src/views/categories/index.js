export class CategoriesRouter {
  configureRouter(config, router) {
    config.map([
      {route: '', name: 'all', moduleId: './categories'},
      {route: ':category_id', name: 'category', moduleId: './category'}
    ]);
  }
}
