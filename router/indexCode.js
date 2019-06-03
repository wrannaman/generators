const beautify = require('js-beautify').js;

module.exports = ({ name }) => {
  const code = `
  module.exports = {
    ${name}: require('./${name}.js'),
  };`;
  const pretty = beautify(code, { indent_size: 2, space_in_empty_paren: true });
  return pretty;
};
