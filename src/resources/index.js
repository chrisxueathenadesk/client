import elements from './elements/index';
import valueConverters from './value-converters/index';
import attributes from './attributes/index';

const resources = {
  elements,
  valueConverters,
  attributes
};

const allResources = Object.keys(resources).map(key => resources[key]).reduce((all, resource) => all.concat(resource), []);

export function configure(config) {
  config.globalResources(allResources);
}
