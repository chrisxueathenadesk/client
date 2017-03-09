export class HomeRouter {
  configureRouter(config, router) {
    config.map([
      {route: '', moduleId: './home', nav: true }
    ]);
  }
}
