const { safeType } = require('../swagger');

module.exports = (schema, name) => {
  const uppercase = require('./uppercase');
  const code = [`// Validation`];
  code.push('// Model Validation ');
  Object.keys(schema).forEach(key => {
    if (schema[key].immutable) return;
    code.push(`if (typeof ${key} !== 'undefined' && \n typeof ${key} === "${safeType(schema[key].type).toLowerCase()}") {`);
    code.push(`existing${uppercase(name)}.${key} = ${key};`);
    code.push(`}`);
  });
  return code.join('\n');
};
