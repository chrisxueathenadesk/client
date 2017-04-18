import 'humanize';

export class toDateValueConverter {
  toView(dateValue, format) {
    const date = new Date(dateValue);
    switch (format) {
    case 'human':
      console.log(date);
      return humanize.relativeTime(date.getTime() / 1000);
    case 'date':
      return date.toLocaleDateString();
    case 'datetime':
      return date.toLocaleString();
    default:
      return date.toLocaleString();
    }
  }
}

