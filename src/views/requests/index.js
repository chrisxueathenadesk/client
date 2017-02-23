export class RequestsRouter {
  heading = 'Requests';

  configureRouter(config, router) {
    config.map([
      {route: '', moduleId: './requests', nav: true, title: 'Requests'},
      {route: '/:request_id', name: 'request', moduleId: './request/index', title: 'Request'}
    ]);
  }
}
