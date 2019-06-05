const fs = require('fs');

module.exports = ({ schema, logging, destination, name }) => {
  const create = require('./create');
  const get = require('./get');
  const getOne = require('./getOne');
  const update = require('./update');
  const remove = require('./delete');
  const indexFile = require('./indexFile');

  // if (logging) console.log('***** API *****');

  const controllerFolder = `${destination}/controller`;
  const controllerSubFolder = `${destination}/controller/${name}`;

  if (!fs.existsSync(controllerFolder)) {
    // if (logging) console.log('creating dir controller ');
    fs.mkdirSync(controllerFolder);
  }
  if (!fs.existsSync(controllerSubFolder)) {
    // if (logging) console.log('creating dir named controller ');
    fs.mkdirSync(controllerSubFolder);
  }

  // if (!fs.existsSync(createFile)) {
  create({ schema, logging, destination, name });
  get({ schema, logging, destination, name });
  getOne({ schema, logging, destination, name });
  update({ schema, logging, destination, name });
  remove({ schema, logging, destination, name });
  indexFile({ schema, logging, destination, name });
  // }

};
