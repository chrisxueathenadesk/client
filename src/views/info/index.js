export class FooterRouter {
  configureRouter(config, router) {
    config.map([
      {route: 'contact', moduleId: './contact', title: 'Contact'},
      {route: 'refunds', moduleId: './refunds', title: 'Refunds'}
    ]);
  }
}

