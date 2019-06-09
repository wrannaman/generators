const createForm = require('./createForm');
const createSnackbar = require('./createSnackbar');

module.exports = ({ schema, destination }) => {
  schema = require(schema); // eslint-disable-line
  if (Array.isArray(schema)) {
    schema.forEach((s) => createForm({ destination, schema: s }));
  } else {
    createForm({ destination, schema });
  }

  createSnackbar({ destination, schema });
};
