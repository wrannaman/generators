const beautify = require('js-beautify').js;

module.exports = ({ names }) => {
  const code = [];
  code.push(`module.exports = {`);
  names.forEach((name) => {
    code.push(`${name}: require('./${name}.js'),`);
  });
  code.push(`};`);
  const pretty = beautify(code.join('\n'), { indent_size: 2, space_in_empty_paren: true });
  return pretty;
};
