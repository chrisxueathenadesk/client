export class RequestsRouter {
  heading = 'Requests';

  configureRouter(config, router) {
    config.map([
      {route: '', moduleId: './requests', nav: true },
      {route: '/:request_id', name: 'request', moduleId: './request/index' }
    ]);
  }
}
