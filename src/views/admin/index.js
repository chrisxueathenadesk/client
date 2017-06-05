export class AdminRouter {
  configureRouter(config, router) {
    config.map([
      { route: '', redirect: 'announcements' },
      {route: '/announcements', moduleId: './announcement/index', nav: true },
      {route: '/brands', moduleId: './brand/index', nav: true },
      {route: '/categories', moduleId: './category/index', nav: true },
      {route: '/countries', moduleId: './country/index', nav: true },
      {route: '/shops', moduleId: './shop/index', nav: true }
    ]);
  }
}

