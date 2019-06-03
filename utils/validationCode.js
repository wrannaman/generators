const uppercase = require('./uppercase');
const { safeType } = require('../swagger');

module.exports = (schema, name) => {
  const code = [`// Validate`];
  Object.keys(schema).forEach(key => {
    code.push(`if (typeof ${key} !== 'undefined' && \n typeof ${key} === "${safeType(schema[key].type).toLowerCase()}") {`);
    code.push(`new${uppercase(name)}.${key} = ${key};`);
    code.push(`}`);
  });
  return code.join('\n');
};
