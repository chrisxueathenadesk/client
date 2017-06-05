import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';

//factory of since we need to pass the path
@inject(Api)
export class RequestView {
  constructor(api) {
    this.api = api;
    this.request = {
      params: {
        include: ['source', 'destination']
      }
    };
  }

  getRequest(id) {
    this.api
      .fetch(`requests/${id}/`, this.request.params)
      .then(request => {
        this.request.data = request;
      })
      .catch(error => {
        this.request.error = error;
      });
  }

  activate(params) {
    // construct model
    // TODO: clean up mixed ways of data retrieval
    const id = Number(params.request_id);
    this.getRequest(id);
  }
}
