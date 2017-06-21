import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';

function marginCalculator(cost, tiers) {
  const marginSpread = tiers.map(tier => {
    const rate = tier.rate / 100;
    if (cost > tier.min && cost < tier.max) {
      // if it's greater than min but less than max
      return Math.abs(cost - tier.max) * rate;
    } else if (cost <= tier.min) {
      // if the product is lower than the price bracket
      return 0;
    } else if (tier.max === undefined) {
      // if highest tier has been reached
      return (cost - tier.min) * rate;
    }
    // by default, return the rate for the specific tier
    return (tier.max - tier.min) * rate;
  });

  return marginSpread.reduce((sum, current) => {
    return sum + current;
  }, 0);
}

@inject(Api)
export class PriceService {
  constructor(api) {
    this.api = api;
  }

  async calculatePrice(product) {
    const country = await this.api.fetch(`countries/${product.source_id}`);
    return product.cost + marginCalculator(product.cost, country.tiers) + (product.cost * 0.07) + (product.weight * country.ems_fee) + (product.local_delivery_fee || 0) + (product.price_override || 0);
  }

  static getDelta(request) {
    let delta = 0;
    if (request.size && request.size.delta) {
      delta = delta + request.size.delta;
    }
    if (request.color && request.color.delta) {
      delta = delta + request.color.delta;
    }
    if (request.variation && request.variation.delta) {
      delta = delta + request.variation.delta;
    }
    return delta;
  }

  static getPrice(request, product) {
    return request.count * (product.price + this.getDelta(request)) + (request.postage || 0);
  }
}

