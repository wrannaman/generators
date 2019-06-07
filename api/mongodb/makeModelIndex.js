const fs = require('fs');
const beautify = require('js-beautify').js;
const modelIndex = require('./modelIndex');

module.exports = ({ destination }) => {
  const modelFolder = `${destination}/models`;
  const indexFile = `${destination}/models/index.js`;
  // if (logging) console.log('updating models/index.js ');
  let items = fs.readdirSync(modelFolder);
  items = items.map((item) => item.replace('.js', ''));
  items = items.filter(item => item !== 'index');
  const code = modelIndex(items);
  const pretty = beautify(code, { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(indexFile, pretty);
};
