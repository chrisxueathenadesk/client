import {bindable} from 'aurelia-framework';
import Hammer from 'hammerjs';

export class Carousel {
  @bindable images = [];

  activeimage = 0;

  attached() {
    this.hammer = new Hammer(this.carousel);
    this.hammer.on('swiperight', this.prev.bind(this));
    this.hammer.on('swipeleft', this.next.bind(this));
  }

  detached() {

  }

  next() {
    this.activeimage = Math.min(this.activeimage + 1, this.images.length - 1);
  }

  prev() {
    this.activeimage = Math.max(this.activeimage - 1, 0);
  }

  goTo(index) {
    this.activeimage = Math.min(Math.max(index, 0), this.images.length);
  }
}
