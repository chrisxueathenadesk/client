export class toListValueConverter {
  fromView(input) {
    return input.split(',').map(str => Number(str));
  }
}

