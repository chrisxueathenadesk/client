import {inject} from 'aurelia-framework';
import {CssAnimator} from 'aurelia-animator-css';

@inject(Element, CssAnimator)
export class AnimateOnChangeCustomAttribute {
  constructor(element, animator) {
    this.element = element;
    this.animator = animator;
    this.initialValueSet = false;
  }

  valueChanged(newValue) {
    if (this.initialValueSet) {
      this.animator.addClass(this.element, this.value).then(() => {
        this.animator.removeClass(this.element, 'background-animation');
      });
    }
    this.initialValueSet = true;
  }
}
