export class AnnouncementRouter {
  configureRouter(config, router) {
    config.map([
      { route: '', redirect: 'list' },
      {route: '/create', name: 'create', moduleId: './create', nav: true },
      {route: '/list', moduleId: './list', nav: true },
      {route: '/:announcement_id/show', name: 'show', moduleId: './show'}
    ]);
  }
}

