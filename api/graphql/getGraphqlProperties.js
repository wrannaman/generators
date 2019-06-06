module.exports = (schema, returnAs = 'csv') => {
  schema = require(schema).schema; // eslint-disable-line
  const str = [];
  Object.keys(schema).forEach(key => {
    str.push(`${key}`);
  });
  return returnAs === 'csv' ? str.join(', ') : str.join('\n');
};
