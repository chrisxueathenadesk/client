export class TripRouter {
  heading = 'Trip';

  configureRouter(config, router) {
    config.map([
      { route: '/', name: 'tripList', moduleId: './list', title: 'List' },
      { route: '/:trip_id', name: 'tripDetails', moduleId: './trip' }
    ]);
  }
}

