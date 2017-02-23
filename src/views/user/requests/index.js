export class RequestsRouter {
  heading = 'Requests';

  configureRouter(config, router) {
    config.map([
      {route: '', moduleId: './requests', nav: true, title: 'Requests'},
      {route: '/create', name: 'create-request', moduleId: './create', nav: true, title: 'Create'}
    ]);
  }
}

