import elements from './elements/index';

const resources = {
  elements
};

const allResources = Object.values(resources).reduce((all, resource) => all.concat(resource), []);

export function configure(config) {
  config.globalResources(allResources);
}
