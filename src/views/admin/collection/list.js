import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {DialogService} from 'aurelia-dialog';
import {CollectionUpdateView} from './update';

@inject(Api, DialogService)
export class CollectionListView {
  collections = {
    params: {}
  }

  constructor(api, dialog) {
    this.api = api;
    this.dialog = dialog;
  }

  getCollections() {
    this.api
    .fetch('collections', this.collections.params)
    .then(data => this.collections.data = data.results)
    .catch(err => console.log(err));
  }

  edit(collection) {
    this.dialog.open({ viewModel: CollectionUpdateView, model: collection })
      .whenClosed(response => {
        this.getCollections();
      });
  }

  delete(id) {
    console.log(id);
  }

  activate() {
    this.getCollections();
  }
}

