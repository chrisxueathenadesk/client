export class RequestRouter {
  heading = 'Products';

  configureRouter(config, router) {
    config.map([
      { route: '', redirect: 'list' },
      { route: '/list', name: 'userRequestList', moduleId: './list', title: 'List' },
      { route: '/:request_id', name: 'userRequest', moduleId: './request' }
    ]);
  }
}

