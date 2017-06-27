export class CountryStore {

  set countries(countries) {
    this._countries = countries;
  }

  get countries() {
    return this._countries;
  }
}
