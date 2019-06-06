module.exports = (schema, fake3A) => {
  const k = Object.keys(fake3A);
  schema = require(schema).schema; // eslint-disable-line
  const genData = require('./genData');
  const randomProperty = k[Math.floor(Math.random() * k.length)];
  fake3A[randomProperty] = genData(schema[randomProperty].type, schema[randomProperty], schema[randomProperty].enum);
  return { fake3A, changedKey: randomProperty };
};
