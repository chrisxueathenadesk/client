const valueConverters = [
  'to-array/to-array',
  'to-number/to-number',
  'to-date/to-date'
];

export default valueConverters.map(vc => `./value-converters/${vc}`);

