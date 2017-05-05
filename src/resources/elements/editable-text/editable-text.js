import {bindable} from 'aurelia-framework';

export class EditableText {
  @bindable store;
  @bindable update;
  @bindable placeholder;
  @bindable key;

  attached() {
    this.tempStore = this.store;
  }

  showInputBox() {
    this.edit = true;
    setTimeout(()=> {
      this.textbox.focus();
    }, 100);
  }

  execute() {
    this.edit = false;
    this.store = this.tempStore;
    this.update({fragment: {[this.key]: this.tempStore}});
  }

  cancel() {
    this.tempStore = this.store;
    this.edit = false;
  }
}
