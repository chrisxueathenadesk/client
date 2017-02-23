import {Factory, inject} from 'aurelia-framework';
import {Request} from '~/models/request';
import {Api} from '~/models/api';

//factory of since we need to pass the path
@inject(Factory.of(Request), Api)
export class RequestView {
  constructor(requestFactory, api) {
    this.api = api;
    this.factory = requestFactory;
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
    this.currentRequest = this.factory(id);
    this.getRequest(id);
  }
}
