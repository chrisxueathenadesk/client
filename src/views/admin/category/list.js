import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {DialogService} from 'aurelia-dialog';
import {CategoryUpdateView} from '~/views/admin/category/update';

@inject(Api, DialogService)
export class CategoryListView {
  categories = {
    params: {}
  }

  constructor(api, dialog) {
    this.api = api;
    this.dialog = dialog;
  }

  getCategories() {
    this.api
    .fetch('categories', this.categories.params)
    .then(data => this.categories.data = data.results)
    .catch(err => console.log(err));
  }

  edit(category) {
    this.dialog.open({ viewModel: CategoryUpdateView, model: category })
      .whenClosed(response => {
        this.getCategories();
      });
  }

  delete(id) {
    console.log(id);
  }

  activate() {
    this.getCategories();
  }
}

