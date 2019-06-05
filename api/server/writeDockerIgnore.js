const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = ({ destination, logging }) => {
  const modelFolder = `${destination}`;
  const indexFile = `${modelFolder}/.dockerignore`;
  // if (logging) console.log('creating eslint');
  const code = ['node_modules'];
  const pretty = beautify(code.join('\n'), { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(indexFile, pretty);
};
