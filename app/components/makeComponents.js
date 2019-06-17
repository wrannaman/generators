const createForm = require('./createForm');
const createSnackbar = require('./createSnackbar');
const createTable = require('./createTable');
const createChipComponent = require('./createChipComponent');
const createChipInputComponent = require('./createChipInputComponent');

module.exports = ({ schema, destination }) => {
  schema = require(schema); // eslint-disable-line
  if (Array.isArray(schema)) {
    schema.forEach((s) => {
      createForm({ destination, schema: s });
      createTable({ destination, schema: s });
    });
  } else {
    createForm({ destination, schema });
    createTable({ destination, schema });
  }

  createSnackbar({ destination, schema });
  createChipComponent({ destination, schema });
  createChipInputComponent({ destination, schema });
};
