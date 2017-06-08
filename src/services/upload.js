import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {ExternalHttp} from '~/services/external-http';

@inject(Api, ExternalHttp)
export class UploadService {
  constructor(api, http) {
    this.api = api;
    this.http = http;
  }

  uploadImages(files, folder) {
    return Promise.all(files.map(file => this.getUploadUrl(file, folder)))
    .then(data => {
      return Promise.all(data.map((response, index) => {
        return this.http.fetch(response.signed_request, {
          method: 'PUT',
          body: files[index]
        })
      }));
    });
  }

  getUploadUrl(file, folder) {
    return this.api
      .fetch('upload', {file_name: file.name, folder_name: folder, file_type: file.type});
  }
}
