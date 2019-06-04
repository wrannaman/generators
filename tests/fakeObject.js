module.exports = (schema) => {
  const genData = require('./genData');
  schema = require(schema).schema; // eslint-disable-line
  const fakeObject = {};
  Object.keys(schema).forEach((key) => {
    fakeObject[key] = genData(schema[key].type);
  });
  return fakeObject;
};
