import {bindable, containerless} from 'aurelia-framework';

@containerless()
export class RequestCard {
  @bindable request;
  // TODO: move request specific methods here
}
