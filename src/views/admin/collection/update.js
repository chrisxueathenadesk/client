import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {notify} from '~/services/notification';
import {DialogController} from 'aurelia-dialog';
import {UploadService} from '~/services/upload';

function filterUntouchedProperties(main, updated) {
  const result = {};
  Object.keys(main).forEach(key => {
    if (main[key] !== updated[key]) {
      result[key] = updated[key];
    }
  });

  return result;
}

@inject(Api, DialogController, UploadService)
export class CollectionUpdateView {
  constructor(api, controller, upload) {
    this.api = api;
    this.upload = upload;
    this.controller = controller;
  }

  activate(collection) {
    this.collection = collection;
    this.newCollection = Object.assign({}, collection);
  }

  update() {
    (this.image ? this.upload.uploadImages(this.image, 'collection') : Promise.resolve())
      .then(res => {
        if (!res) {
          return Promise.resolve();
        }
        this.newCollection.banner = res.map(file => file.url.split('?')[0])[0];
        return this.api.edit(`collections/${this.collection.id}`, filterUntouchedProperties(this.collection, this.newCollection));
      })
    .then(success => {
      notify().log('Successfully updated');
      this.controller.ok();
    })
    .catch(err => {
      this.controller.cancel();
      return console.log(err);
    });
  }
}

