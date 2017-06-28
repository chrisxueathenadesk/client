import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';

@inject(Api)
export class CollectionView {
  collectionproducts = {};

  constructor(api) {
    this.api = api;
  }

  activate(param) {
    this.api
      .fetch(`collections/${param.collection_id}/collectionproducts`, {include: ['product']})
      .then(products => {
        this.collectionproducts.data = products.results;
      })
      .catch(err => this.collectionproducts.error = err);
  }
}
