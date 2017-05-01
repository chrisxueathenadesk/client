import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)
export class Searchbar {
  constructor(router) {
    this.router = router;
  }

  showResults() {
    this.router.navigateToRoute('filter', {search: this.query});
  }
}
