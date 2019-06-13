const mkdirp = require('mkdirp');
const fs = require('fs');

// const makeStatics = require('./statics/makeStatics');
// const makeSrc = require('./src/makeSrc');
// const makePages = require('./pages/makePages');
// const makeComponents = require("./components/makeComponents");
const createHTMLCreateForm = require('./createHTMLCreateForm');
const createJSCreateForm = require('./createJSCreateForm');
const createJSTable = require('./createJSTable');
const createHTMLTable = require('./createHTMLTable');

const { uppercase } = require('../api/utils');

const embeddableSet = ({ schema, destination }) => {
  createHTMLCreateForm({ destination, schema });
  createJSCreateForm({ destination, schema });
  createJSTable({ destination, schema });

  // Table isnt working. Can't seem to find the export for material-table
  // createHTMLTable({ destination, schema });
}

module.exports = async ({ schema, destination }) => {
  if (process.env.NODE_ENV !== 'dev' && fs.existsSync(args.destination)) return console.log(`uh oh, looks like there's something already at ${args.destination}`); // eslint-disable-line
  mkdirp.sync(destination);
  schema = require(schema); // eslint-disable-line
  if (Array.isArray(schema)) {
    schema.forEach((s) => {
      mkdirp.sync(`${destination}/${uppercase(s.name)}`);
      embeddableSet({ destination, schema: s });
      // console.log('yes array', s);
    });
  } else {
    embeddableSet({ destination, schema });
  }
};
