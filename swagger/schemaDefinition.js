module.exports = ({ schema, name }) => {
  const safeType = require('./safeType');
  const { uppercase } = require('../utils');
  schema = require(schema);
  const code = [
    `      ${uppercase(name)}:`,
    `        properties:`,
  ];
  Object.keys(schema.schema).forEach(key => {
    let value = schema.schema[key];
    if (value.type) {
      code.push(`          ${key}:`);
      code.push(`            type: ${safeType(value.type.toLowerCase())}`)
    } else {
      code.push(`          ${key}:`);
      code.push(`            type: object`)
      code.push(`            properties:`)
      Object.keys(value).forEach(_key => {
        const _value = value[_key];
        code.push(`              ${_key}:`);
        code.push(`                type: ${safeType(_value.type.toLowerCase())}`)
      })
    }
  });
  return code.join('\n')
}
