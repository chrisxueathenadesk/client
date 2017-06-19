import environment from '~/environment';
import {constants} from '~/services/constants';

export class AdwordsService {
  set gclid(value) {
    this._gclid = value;
  }

  get gclid() {
    return this._gclid;
  }

  googleTrackConversion(data) {
    if (!environment.adwordtracking) {
      return;
    }
    return window.google_trackConversion(Object.assign({}, environment.adwords, data));
  }

  reportSales(total) {
    if (!this.gclid) {
      return;
    }
    return this.googleTrackConversion({
      google_conversion_label: constants.adwordsConversionLabels.purchase,
      google_conversion_value: total
    });
  }

  reportBuyNowAction() {
    if (!this.gclid) {
      return;
    }
    return this.googleTrackConversion({
      google_conversion_label: constants.adwordsConversionLabels.buyNow
    });
  }
}
