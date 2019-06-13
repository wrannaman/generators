module.exports = (schema) => {
  try {
    schema = require(schema); // eslint-disable-line
    if (Array.isArray(schema)) {
      let isValid = false;
      schema.forEach((s) => {
        // schema name required
        if (!s.name) isValid = "Each schema requires a name";
        if (s.schema) isValid = true;
      });
      return isValid;
    } else {
      // schema name required
      if (!schema.name) return "Schema requires a name";
      if (schema.schema) return true;
    }
    return false;
  } catch (e) {
    if (e.message && e.message.indexOf('Unexpected token')) {
      let msg = e.message.split('Unexpected token');
      if (msg && msg[1]) {
        msg = msg[1].split('at position ');
        return `Uh oh, JSON syntax mistake. Check line ${msg[1]}.`;
      }
    }
    if (e.message && e.message.indexOf('Cannot find module') !== -1) {
      return "Can't find this json file. Does it exist?";
    }
    return false;
  }
};
