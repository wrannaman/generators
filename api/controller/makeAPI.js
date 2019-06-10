const fs = require('fs');


const doMakeApi = ({ schema, logging, destination, name }) => {
  const create = require('./create');
  const get = require('./get');
  const getOne = require('./getOne');
  const update = require('./update');
  const remove = require('./delete');
  const indexFile = require('./indexFile');

  const controllerSubFolder = `${destination}/controller/${name}`;

  if (!fs.existsSync(controllerSubFolder)) {
    fs.mkdirSync(controllerSubFolder);
  }

  create({ schema, logging, destination, name });
  get({ schema, logging, destination, name });
  getOne({ schema, logging, destination, name });
  update({ schema, logging, destination, name });
  remove({ schema, logging, destination, name });
  indexFile({ schema, logging, destination, name });
};

module.exports = ({ schema, logging, destination }) => {

  const controllerFolder = `${destination}/controller`;
  if (!fs.existsSync(controllerFolder)) {
    fs.mkdirSync(controllerFolder);
  }

  schema = require(schema); // eslint-disable-line
  if (Array.isArray(schema)) {
    schema.forEach((_schema) => {
      console.log("SCHEMA =>", _schema.name);
      doMakeApi({ schema: _schema, logging, destination, name: _schema.name });
    });
  } else {
    const name = schema.name; // eslint-disable-line
    console.log("SCHEMA =>", name);
    doMakeApi({ schema, logging, destination, name });
  }
};
