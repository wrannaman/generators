const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = async (fileName) => {
  fileName = `${fileName}/next.config.js`;

  const code = `module.exports = {};`;
  const pretty = beautify(code, { indent_size: 2, space_in_empty_paren: true });
  if (!fs.existsSync(fileName)) fs.writeFileSync(fileName, pretty);
};
