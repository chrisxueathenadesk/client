import {bindable} from 'aurelia-framework';
import animateScrollTo from 'animated-scroll-to';

export class Pagination {
  @bindable total;
  @bindable page;
  @bindable fetcher;

  paginate(pageNumber) {
    this.page.number = pageNumber;
    this.fetcher();
    animateScrollTo(0);
  }
}

