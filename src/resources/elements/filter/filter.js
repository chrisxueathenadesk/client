import {bindable} from 'aurelia-framework';

export class Filter {
  @bindable values;
  @bindable model;
  @bindable change;

  onChange() {
    console.log(this.model);
    this.model.params.where['platform:eq'] = 2;
    this.change();
  }

  // onChange(option) {
  //   this.targetModel.filter[`${option.key}`] = option.value;
  //   this.target.getItems();
  // }

  // attached() {
    // this.model = Container.instance.get(this.modelName);
    // this.targetModel = Container.instance.get(this.targetModelName);
    // this.items = this.model.getItems();
  // }
}
