import {ValidationRules} from 'aurelia-validation';

export class Product {
  name;
  category_id;
  brand_id;
  source_id;
  order_count;
  preorder;
  featured;
  price;
  weight;
  dimensions;
  platform_charge;
  delivery_time;
  colors;
  editions;
  sizes;
  gallery;
  currency;
  url;
  description;
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

