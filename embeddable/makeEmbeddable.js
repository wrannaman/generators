const mkdirp = require('mkdirp');
const fs = require('fs');

// const makeStatics = require('./statics/makeStatics');
// const makeSrc = require('./src/makeSrc');
// const makePages = require('./pages/makePages');
// const makeComponents = require("./components/makeComponents");
const createHTMLCreateForm = require('./createHTMLCreateForm');
const createJSCreateForm = require('./createJSCreateForm');

const { uppercase } = require('../api/utils');

module.exports = async ({ schema, destination }) => {
  if (process.env.NODE_ENV !== 'dev' && fs.existsSync(args.destination)) return console.log(`uh oh, looks like there's something already at ${args.destination}`); // eslint-disable-line
  mkdirp.sync(destination);
  schema = require(schema); // eslint-disable-line
  if (Array.isArray(schema)) {
    schema.forEach((s) => {
      createHTMLCreateForm({ destination, schema: s });
      createJSCreateForm({ destination, schema: s });
      // createJS({ destination, schema: s });
      mkdirp.sync(`${destination}/${uppercase(s.name)}`);
      // console.log('yes array', s);
    });
  } else {
    // createForm({ destination, schema });
    // createTable({ destination, schema });
  }
};
