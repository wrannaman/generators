const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = ({ schema, logging, destination, name }) => {
  if (logging) console.log(`  API => REST => INDEX ${name}`);
  const { uppercase } = require('../utils');
  const controllerSubFolder = `${destination}/controller/${name}`;
  const createFile = `${controllerSubFolder}/index.js`;

  const code = `
  const create${uppercase(name)} = require('./create');
  const get${uppercase(name)} = require('./get');
  const getOne${uppercase(name)} = require('./getOne');
  const update${uppercase(name)} = require('./update');
  const delete${uppercase(name)} = require('./delete${uppercase(name)}');

  module.exports = {
    create${uppercase(name)},
    get${uppercase(name)},
    getOne${uppercase(name)},
    update${uppercase(name)},
    delete${uppercase(name)},
  };

  `;
  const pretty = beautify(code, { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(createFile, pretty);
};
