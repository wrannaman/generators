const mkdirp = require('mkdirp');
const makeRestTests = require('./makeRestTests');

module.exports = ({ schema, destination, logging }) => {
  schema = require(schema);  // eslint-disable-line
  const isArray = Array.isArray(schema);
  const modelFolder = `${destination}/test`;
  mkdirp.sync(modelFolder);
  if (isArray) {
    schema.forEach((s) => makeRestTests({ schema: s, destination, logging }));
  } else {
    makeRestTests({ schema, destination, logging });
  }
};
