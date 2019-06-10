const uppercase = require('./uppercase');
const beautify = require('js-beautify').js;

const searchCodeByType = (type, key) => {
  const returnCode = [];
  switch (type.toLowerCase()) {
    case 'number':
      returnCode.push(`if (!isNaN(search)) { find.$or.push({ ${key}: { $eq: search } }); }`);
      break;
    case 'boolean':
      returnCode.push(`if (search === 'true' || search === 'false') { find.$or.push({ ${key}: search === 'true' ? true : false }); }`);
      break;
    case 'objectid':
    case 'string':
      returnCode.push(`find.$or.push({ ${key}: { $regex: new RegExp(search, "ig") } })`);
      break;
    default:
  }

  return returnCode
}

module.exports = (schema, name) => {
  let code = ['find.$or = [];'];
  Object.keys(schema.schema).forEach((key) => {
    const item = schema.schema[key];
    if (item.type) {
      code = code.concat(searchCodeByType(item.type, key));
    } else {
      console.log('sub document');
      Object.keys(item).forEach((_key) => {
        code = code.concat(searchCodeByType(item[_key].type, `"${key}.${_key}"`));
      })
    }
  });
  const pretty = beautify(code.join('\n'), { indent_size: 2, space_in_empty_paren: true });
  console.log('PRETTY', pretty)
  return pretty;
};
