const valueConverters = [
  'to-array',
  'to-number',
  'to-date',
  'markdown',
  'to-currency'
];

export default valueConverters.map(vc => `./value-converters/${vc}`);

