const valueConverters = [
  'to-array',
  'to-number',
  'to-date'
];

export default valueConverters.map(vc => `./value-converters/${vc}`);

