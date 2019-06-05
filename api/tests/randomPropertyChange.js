module.exports = (schema, fake3A) => {
  const k = Object.keys(fake3A);
  schema = require(schema).schema; // eslint-disable-line
  const genData = require('./genData');
  fake3A[k[0]] = genData(schema[k[0]].type);
  const changedKey = k[0];
  return { fake3A, changedKey };
};
