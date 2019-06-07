module.exports = (schema) => {
  try {
    schema = require(schema); // eslint-disable-line
    if (Array.isArray(schema)) {
      let isValid = false;
      schema.forEach((s) => {
        // schema name required
        if (!s.name) isValid = false;
        if (s.schema) isValid = true;
      });
      return isValid;
    } else {
      // schema name required
      if (!schema.name) return false;
      if (schema.schema) return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};
