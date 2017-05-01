export class SearchRouter {
  configureRouter(config, router) {
    config.map([
      {route: '', moduleId: './filter'}
    ]);
  }
}
