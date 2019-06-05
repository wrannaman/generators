const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = ({ destination, logging, }) => {
  const modelFolder = `${destination}`;
  const indexFile = `${modelFolder}/.eslintrc`;
  const code = require('./eslint.json')
  // if (logging) console.log('creating eslint');
  fs.writeFileSync(indexFile, JSON.stringify(code, null, 2));
};
