import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {ExternalHttp} from '~/services/external-http';
import {notify} from '~/services/notification';

@inject(Api, ExternalHttp)
export class CategoryCreateView {
  constructor(api, http) {
    //TODO: Create a model for validation
    this.api = api;
    this.http = http;
  }

  activate() {
    this.api
      .fetch('categories')
      .then(data => this.categories = data.results)
      .catch(err => console.log(err));
  }

  create() {
    this
      .getUploadUrl(this.image[0], 'category')
      .then(res => {
        this.category.image = res.signed_request.split('?')[0];
        return this.http.fetch(res.signed_request, {
          method: 'PUT',
          body: this.image[0]
        });
      })
      .then((res) => this.api.create('categories', this.category))
      .then(success => {
        notify().log('Successfully created!');
        this.category = {};
      })
      .catch(err => console.log(err));
  }

  getUploadUrl(file, type) {
    return this.api
      .fetch('upload', {file_name: file.name, folder_name: type, file_type: file.type});
  }
}

