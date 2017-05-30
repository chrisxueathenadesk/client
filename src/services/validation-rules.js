export const customRules = {
  numberRange: ['numberRange',
    (value, obj, min, max) => value === null || value === undefined || typeof value === 'number' && value >= min && value <= max,
    `\${$displayName} must be a number between \${$config.min} and \${$config.max}.`,
    (min, max) => ({ min, max })]
};
