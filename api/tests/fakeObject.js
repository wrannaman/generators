module.exports = (schema, asString = false) => {
  const genData = require('./genData');
  schema = require(schema).schema; // eslint-disable-line
  const fakeObject = {};
  Object.keys(schema).forEach((key) => {
    fakeObject[key] = genData(schema[key].type, schema[key], schema[key].enum);
  });

  if (!asString) return fakeObject;

  // into string
  let str = [];
  Object.keys(fakeObject).forEach(key => {
    const value = schema[key].type === 'String' ? `"${fakeObject[key]}"` : fakeObject[key];
    str.push(`${key}: ${value}`);
  });
  return { obj: fakeObject, str };
};
