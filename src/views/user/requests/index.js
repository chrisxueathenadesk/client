export class UserRequestsRouter {
  heading = 'Requests';

  configureRouter(config, router) {
    config.map([
      {route: '', name: 'userRequestList', moduleId: './list'},
      {route: ':request_id', name: 'userRequest', moduleId: './request'}
    ]);
  }
}

