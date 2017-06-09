const valueConverters = [
  'to-array',
  'to-number',
  'to-date',
  'markdown'
];

export default valueConverters.map(vc => `./value-converters/${vc}`);

