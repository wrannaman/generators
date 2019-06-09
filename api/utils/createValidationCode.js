const uppercase = require('./uppercase');
const { safeType } = require('../swagger');

module.exports = (schema, name) => {
  const code = [`// Validate`];
  Object.keys(schema).forEach(key => {
    let extraValid = "";
    if (safeType(schema[key].type).toLowerCase() === 'string') {
      extraValid = `&& ${key}`;
    }
    code.push(`if (typeof ${key} !== 'undefined' && \n typeof ${key} === "${safeType(schema[key].type).toLowerCase()}" ${extraValid}) {`);
    code.push(`new${uppercase(name)}.${key} = ${key};`);
    code.push(`}`);
  });
  return code.join('\n');
};
