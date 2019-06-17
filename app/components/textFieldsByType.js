const textFieldByType = require('./textFieldByType');
const tagsComponent = require('./tagsComponent');

module.exports = (schema, destination) => {
  // textFieldByType(type, name)
  const code = [];
  Object.keys(schema.schema).forEach(async (key) => {
    if (schema.schema[key].type) {
      code.push(textFieldByType(key, schema.schema[key].type, schema.schema[key]));
    } else if (Array.isArray(schema.schema[key])) {
      console.warn('UNIMPLEMENTED SUB ARRAY ya array ', key);
      // if it's an array of strings, tags work great.
      code.push(textFieldByType(key, 'Array', schema.schema[key]));
    } else {
      Object.keys(schema.schema[key]).forEach((_key) => {
        code.push(textFieldByType(`${key}.${_key}`, schema.schema[key][_key].type, schema.schema[key][_key]));
      });
    }
  });
  return code.join('\n');
};
