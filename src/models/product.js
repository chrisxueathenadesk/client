import {ValidationRules} from 'aurelia-validation';

export class Product {
  brand_id;
  category_id;
  colors;
  courier;
  currency;
  delivery_time;
  description;
  dimensions;
  featured;
  gallery;
  name;
  order_count;
  platform_charge;
  postage;
  preorder;
  price;
  sizes;
  source_id;
  url;
  variations;
  weight;
}

ValidationRules
  .ensure(product => product.category_id)
    .required()
  .ensure(product => product.name)
    .required()
  .ensure(product => product.source_id)
    .required()
  .ensure(product => product.delivery_time)
    .displayName('Delivery time')
    .required()
  .ensure(product => product.description)
    .minLength(100)
    .required()
  .ensure(product => product.price)
    .required()
    .satisfiesRule('numberRange', 1, 10000)
  .ensure(product => product.currency)
    .required()
  .on(Product);

