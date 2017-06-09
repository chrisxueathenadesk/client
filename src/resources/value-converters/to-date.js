import 'humanize';

export class ToDateValueConverter {
  toView(dateValue, format) {
    if (dateValue === null || dateValue === undefined) {
      return 'unspecified';
    }
    const date = new Date(dateValue);
    switch (format) {
    case 'human':
      return humanize.relativeTime(date.getTime() / 1000);
    case 'date':
      return date.toDateString();
    case 'datetime':
      return date.toLocaleString();
    default:
      return date.toLocaleString();
    }
  }
}

