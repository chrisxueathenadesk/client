import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';

@inject(Api)
export class CategoriesView {
  categories = {
    params: {
      include: ['products', 'parent.^']
    }
  }
  constructor(api) {
    this.api = api;
  }

  activate() {
    this.api
      .fetch('categories')
      .then(categories => this.categories.data = categories.results)
      .catch(err => this.categories.error = err);
  }
}
