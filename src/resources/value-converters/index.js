const valueConverters = [
  'to-array/to-array',
  'to-number/to-number'
];

export default valueConverters.map(vc => `./value-converters/${vc}`);

