const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = ({ schema, logging, destination, name }) => {
  const { modelIndex } = require('../code');
  const create = require('./create');
  if (logging) console.log('***** API *****');

  const controllerFolder = `${destination}/controller`;
  const controllerSubFolder = `${destination}/controller/${name}`;
  const indexFile = `${controllerSubFolder}/index.js`;
  const createFile = `${controllerSubFolder}/create.js`;
  const updateFile = `${controllerSubFolder}/update.js`;
  const deleteFile = `${controllerSubFolder}/delete.js`;
  const getFile = `${controllerSubFolder}/get.js`;


  if (!fs.existsSync(controllerFolder)) {
    if (logging) console.log('creating dir controller ');
    fs.mkdirSync(controllerFolder);
  }
  if (!fs.existsSync(controllerSubFolder)) {
    if (logging) console.log('creating dir named controller ');
    fs.mkdirSync(controllerSubFolder);
  }

  // if (!fs.existsSync(createFile)) {
  create({ schema, logging, destination, name })
  // }


  // const indexFile = `${destination}/models/index.js`;
  // if (logging) console.log('updating models/index.js ');
  // let items = fs.readdirSync(modelFolder);
  // items = items.map((item) => item.replace('.js', ''));
  // items = items.filter(item => item !== 'index');
  // const code = modelIndex(items);
  // const pretty = beautify(code, { indent_size: 2, space_in_empty_paren: true });
  // fs.writeFileSync(indexFile, pretty);
}
