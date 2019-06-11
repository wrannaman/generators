const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = async (fileName) => {
  fileName = `${fileName}/config.json`;
  const code = `
{
  "apiURL": "http://localhost:7777"
}
  `;
  const pretty = beautify(code, { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(fileName, pretty);
};
