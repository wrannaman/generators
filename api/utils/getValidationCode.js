const uppercase = require('./uppercase');
const { safeType, safeDefault } = require('../swagger');

module.exports = (schema) => {
  const extras = require('./extraParams');
  const returnValueBasedOnType = require('./returnValueBasedOnType');
  const code = [`// Validation`];

  // pagination, etc.
  const extraKeys = Object.keys(extras);
  if (extraKeys.length > 0) {
    code.push('// Pagination ');
    code.push(`if (sort && typeof sort === 'string') sort = JSON.parse(sort);`);
    extraKeys.forEach(key => {
      code.push(`if (typeof ${key} !== 'undefined' && ${key} !== '') {`);
      code.push(`where.${key} = ${returnValueBasedOnType(extras[key].type, key)};`);
      if (typeof extras[key].default !== 'undefined') {
        code.push(`} else {`);
        code.push(` where.${key} = ${safeDefault(extras[key].default)};`);
        code.push(`}`);
      } else {
        code.push('}');
      }
    });
  }
  // code.push(`where.limit = limit;`);
  code.push(`where.offset = page * limit;`);
  code.push('// Model Validation ');
  Object.keys(schema).forEach(key => {
    code.push(`if (typeof ${key} !== 'undefined') {`);
    code.push(` try {`);
    code.push(`find.${key} = JSON.parse(${key})`);
    code.push(` } catch (e) {`);
    code.push(`find.${key} = ${returnValueBasedOnType(schema[key].type, key)};`);
    code.push(`}`);
    code.push(`}`);
  });
  return code.join('\n');
};
