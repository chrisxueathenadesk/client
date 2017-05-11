import {bindable} from 'aurelia-framework';

export class EditableAddress {
  @bindable address;
  @bindable key;
  @bindable callback;

  attached() {
    this.tempAddress = Object.assign({}, this.address);
  }

  showEditable() {
    this.edit = true;
    setTimeout(()=> {
      this.firstLine.focus();
    }, 100);
  }

  cancel() {
    this.tempAddress = Object.assign({}, this.address);
    this.edit = false;
  }

  saveAddress() {
    this.edit = false;
    this.address = Object.assign({}, this.tempAddress);
    this.callback({address: {[this.key]: this.tempAddress}});
  }
}
