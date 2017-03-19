export class RequestRouter {
  configureRouter(config, router) {
    config.map([
      {route: '', moduleId: './request', nav: true, title: 'Request'}
    ]);
  }
}
