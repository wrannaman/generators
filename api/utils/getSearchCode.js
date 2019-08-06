const uppercase = require('./uppercase');
const beautify = require('js-beautify').js;

const searchCodeByType = (type, key, isArray = false) => {
  const returnCode = [];

  switch (type.toLowerCase()) {
    case 'number':
      if (isArray) {
        returnCode.push(`if (!isNaN(search)) { find.$or.push({ ${key}: { $in: [search] } }); }`);
      } else {
        returnCode.push(`if (!isNaN(search)) { find.$or.push({ ${key}: { $eq: search } }); }`);
      }
      break;
    case 'boolean':
      if (isArray) {
        returnCode.push(`if (search === 'true' || search === 'false') { find.$or.push({ ${key}: { $in: [search === 'true' ? true : false] } }); }`);
      } else {
        returnCode.push(`if (search === 'true' || search === 'false') { find.$or.push({ ${key}: search === 'true' ? true : false }); }`);
      }
      break;
    case 'objectid':
    case 'string':
      if (isArray) {
        console.log('ISARRAY', isArray, key)
        returnCode.push(`find.$or.push({ ${key}: { $in: [search] } })`);
      } else {
        returnCode.push(`find.$or.push({ ${key}: { $regex: new RegExp(search, "ig") } })`);
      }
      break;
    default:
  }
  return returnCode;
};

module.exports = (schema, name) => {
  let code = ['find.$or = [];'];
  Object.keys(schema.schema).forEach((key) => {
    const item = schema.schema[key];
    if (item.type) {
      code = code.concat(searchCodeByType(item.type, key));
    } else if (Array.isArray(item)) {
      item.forEach((i) => {
        if (i.type) {
          code = code.concat(searchCodeByType(i.type, `${key}`, true));
        } else {
          Object.keys(i).forEach((_key) => {
            code = code.concat(searchCodeByType(i[_key].type, `"${key}.${_key}"`));
          });
        }
      })

    } else {
      Object.keys(item).forEach((_key) => {
        code = code.concat(searchCodeByType(item[_key].type, `"${key}.${_key}"`));
      });
    }
  });
  const pretty = beautify(code.join('\n'), { indent_size: 2, space_in_empty_paren: true });
  return pretty;
};
