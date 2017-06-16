export class PriceService {
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

