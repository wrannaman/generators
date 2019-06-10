const textFieldByType = require('./textFieldByType');

module.exports = (schema) => {
  // textFieldByType(type, name)
  const code = [];
  Object.keys(schema.schema).forEach((key) => {
    if (schema.schema[key].type) {
      code.push(textFieldByType(key, schema.schema[key].type, schema.schema[key]));
    } else {
      Object.keys(schema.schema[key]).forEach((_key) => {
        code.push(textFieldByType(`${key}.${_key}`, schema.schema[key][_key].type, schema.schema[key][_key]));
      });
    }
  });
  return code.join('\n');
};
