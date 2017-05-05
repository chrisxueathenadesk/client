import {bindable} from 'aurelia-framework';

export class EditableAddress {
  @bindable address;
  @bindable key;
  @bindable callback;

  attached() {
    this.tempAddress = this.address;
  }

  showEditable() {
    this.edit = true;
    setTimeout(()=> {
      this.firstLine.focus();
    }, 100);
  }

  cancel() {
    this.tempAddress = this.address;
    this.edit = false;
  }

  saveAddress() {
    this.edit = false;
    this.address = this.tempAddress;
    this.callback({address: {[this.key]: this.tempAddress}});
  }
}
