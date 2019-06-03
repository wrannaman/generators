const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = ({ destination, logging, }) => {
  const modelFolder = `${destination}`;
  const indexFile = `${modelFolder}/package.json`;
  const code = require('./package.json')
  if (logging) console.log('checking server index ');
  if (logging) console.log('creating server entrypoint');
  fs.writeFileSync(indexFile, JSON.stringify(code, null, 2));
};
