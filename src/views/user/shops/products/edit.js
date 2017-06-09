import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {notify} from '~/services/notification';
import {utilities} from '~/services/utilities';

@inject(Api)
export class EditProductView {
  constructor(api) {
    this.api = api;
  }

  activate(params) {
    this.params = params;
    this.api
      .fetch(`products/${params.product_id}`)
      .then(product => {
        this.product = product;
        this.newProduct = JSON.parse(JSON.stringify(this.product));
      })
      .catch(err => {
        console.log(err);
      });
  }

  edit() {
    const fragment = utilities.filterUntouchedProperties(this.product, this.newProduct);
    console.log(fragment);
    this.api
      .edit(`products/${this.params.product_id}`, fragment)
      .then(success => notify().log('Successfully Updated'))
      .catch(err => console.log(err));
  }

  swap(from, to) {
    console.log(from, to);
    const temp = this.newProduct.gallery[to];
    this.newProduct.gallery[to] = this.newProduct.gallery[from];
    this.newProduct.gallery[from] = temp;
    console.log(this.newProduct.gallery);
    console.log(this.product.gallery);
  }

  cancel(property) {
    this.newProduct[property] = this.product[property];
  }
}
