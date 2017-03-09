import {bindable, containerless} from 'aurelia-framework';

@containerless()
export class ProductCard {
  @bindable product;
}
