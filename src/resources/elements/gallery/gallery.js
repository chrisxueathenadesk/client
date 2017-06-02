import {bindable} from 'aurelia-framework';
import Hammer from 'hammerjs';

export class Gallery {
  @bindable images = [];

  activeImage = 0;

  attached() {
    this.hammer = new Hammer(this.galleryElement);
    this.hammer.on('swiperight', this.prev.bind(this));
    this.hammer.on('swipeleft', this.next.bind(this));

    setInterval(this.next.bind(this), 4000);
  }

  detached() {
    this.hammer.destroy();
  }

  next() {
    this.goTo(this.activeImage + 1);
  }

  prev() {
    this.goTo(this.activeImage - 1);
  }

  goTo(index) {
    this.activeImage = (index >= 0 && index < this.images.length) ? index : 0;
  }
}
