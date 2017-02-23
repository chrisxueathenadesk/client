export class RequestRouter {
  heading = 'Request';

  configureRouter(config, router) {
    config.map([
      { route: '', redirect: 'request' },
      {route: '/create', moduleId: './create', nav: true, title: 'Create'},
      {route: '/:request_id', moduleId: './request', nav: true, title: 'Request'}
    ]);
  }
}

