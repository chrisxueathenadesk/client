import {bindable} from 'aurelia-framework';

export class Pagination {
  @bindable total;
  @bindable page;
  @bindable fetcher;

  paginate(pageNumber) {
    this.page.number = pageNumber;
    this.fetcher();
  }
}

