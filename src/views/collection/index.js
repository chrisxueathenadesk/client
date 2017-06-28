export class CollectionRouter {
  configureRouter(config, router) {
    config.map([
      {route: '', name: 'all', moduleId: './list'},
      {route: ':collection_id', name: 'collection', moduleId: './collection'}
    ]);
  }
}
