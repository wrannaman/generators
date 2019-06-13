const fo = (schema, asString = false, parseSchema = true) => {
  const genData = require('./genData');

  // if (parseSchema) schema = require(schema).schema; // eslint-disable-line
  const fakeObject = {};
  Object.keys(schema).forEach((key) => {
    fakeObject[key] = genData(schema[key].type, schema[key], schema[key].enum);
  });

  if (!asString) return fakeObject;

  // into string
  const str = [];
  Object.keys(fakeObject).forEach(key => {

    const value = schema[key].type === 'String' ? `"${fakeObject[key]}"` : fakeObject[key];
    const isObject = typeof value === 'object';
    let abstractedValue = value;
    if (isObject) {
      if (asString) {
        const _str = [];
        Object.keys(value).forEach(_key => {
          _str.push(`${_key}: ${value[_key]}`);
        });
        abstractedValue = `" ${_str.join(', ')} "`;
      }
    }
    str.push(`${key}: ${abstractedValue}`);
  });
  return { obj: fakeObject, str: str.join(', ') };
};
module.exports = fo;
