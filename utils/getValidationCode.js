const uppercase = require('./uppercase');
const { safeType, safeDefault } = require('../swagger');

module.exports = (schema, name, extras = {}) => {
  const code = [`// Validation`];

  // pagination, etc.
  const extraKeys = Object.keys(extras);
  if (extraKeys.length > 0) {
    code.push('// Pagination ');
    extraKeys.forEach(key => {
      code.push(`if (typeof ${key} !== 'undefined' && \n typeof ${key} === "${safeType(extras[key].type).toLowerCase()}") {`);
      code.push(`where.${key} = ${extras[key].type === 'number' ? `Number(${key})` : key};`);
      if (typeof extras[key].default !== 'undefined') {
        code.push(`} else {`);
        code.push(` where.${key} = ${safeDefault(extras[key].default)};`);
        code.push(`}`);
      } else {
        code.push('}');
      }
    });
  }
  code.push(`where.limit = limit;`);
  code.push(`where.offset = page * limit;`);
  code.push('// Model Validation ');
  Object.keys(schema).forEach(key => {
    code.push(`if (typeof ${key} !== 'undefined' && \n typeof ${key} === "${safeType(schema[key].type).toLowerCase()}") {`);
    code.push(`find.${key} = ${key};`);
    code.push(`}`);
  });
  return code.join('\n');
};
