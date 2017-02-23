import {bindable} from 'aurelia-framework';

export class PlatformFilter {
  @bindable values;
  @bindable store;
  @bindable change;

  onChange(value) {
    this.store.params.filter['platform.id:eq'] = value;
    this.change({params: this.store.params});
  }
}
