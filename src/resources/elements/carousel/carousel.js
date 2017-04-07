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
    this.goTo(this.activeImage + 1);
  }

  prev() {
    this.goTo(this.activeImage - 1);
  }

  goTo(index) {
    this.activeimage = Math.min(Math.max(index, 0), this.images.length);
  }
}
