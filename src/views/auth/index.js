export class LoginRouter {
  configureRouter(config, router) {
    config.map([
      {route: '', redirect: 'login'},
      {route: 'login', name: 'login', moduleId: './login', nav: true},
      {route: 'signup', name: 'signup', moduleId: './signup'},
      {route: 'reset', name: 'reset', moduleId: './reset'},
      {route: 'verify', name: 'verify', moduleId: './verify'}
    ]);
  }
}
