module.exports = (schema) => {
  try {
    schema = require(schema); // eslint-disable-line
    if (schema.schema && schema.statics) return true;
    return false;
  } catch (e) {
    return false;
  }
};
