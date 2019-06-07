const randChange = (schema, fake3A, doRequire = true) => {
  const k = Object.keys(fake3A);
  // if (doRequire) schema = require(schema).schema; // eslint-disable-line
  const genData = require('./genData');
  const randomProperty = k[Math.floor(Math.random() * k.length)];
  fake3A[randomProperty] = genData(schema[randomProperty].type, schema[randomProperty], schema[randomProperty].enum);
  // dont select unique properties to change or ones that don't get returned
  if (schema[randomProperty].unique ||
    schema[randomProperty].select === false ||
    schema[randomProperty].type === "ObjectId") {
    return randChange(schema, fake3A, false);
  }
  return { fake3A, changedKey: randomProperty };
};
module.exports = randChange;
