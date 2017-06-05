import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';

@inject(Api)
export class AnnouncementShowView {
  constructor(api) {
    this.api = api;
  }

  activate(params) {
    this.api.fetch(`announcements/${params.announcement_id}`)
    .then(data => this.announcement = data)
    .catch(err => console.log(err));
  }
}
