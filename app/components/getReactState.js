const typeToValue = require('./typeToValue');

module.exports = (schema, stringify = false, keysOnly = false) => {
  const obj = {};
  const nestedKeys = {};
  Object.keys(schema.schema).forEach((key) => {
    let val = "";
    if (!schema.schema[key].type) {
      if (Array.isArray(schema.schema[key])) {
        val = [];
        schema.schema[key].forEach((arrayObject, index) => {
          if (arrayObject.type) {
            const item = schema.schema[key][index];
            obj[`${key}StringValue`] = item.default ? item.default : typeToValue(item.type);
            val.push(item.default ? item.default : typeToValue(item.type));
          } else {
            const _sub = {};
            Object.keys(arrayObject).forEach((_key) => {
              obj[`${_key}StringValue`] = typeToValue(arrayObject[_key].type);
              _sub[key] = arrayObject[_key].default ? arrayObject[_key].default : typeToValue(arrayObject[_key].type);
            });
          }
        });
      } else {
        val = {};
        Object.keys(schema.schema[key]).forEach((_key) => {
          val[_key] = schema.schema[key][_key].default ? schema.schema[key][_key].default : typeToValue(schema.schema[key][_key].type);
          if (!nestedKeys[key]) nestedKeys[key] = [];
          nestedKeys[key].push(_key);
        });
      }

    } else {
      val = schema.schema[key].default ? schema.schema[key].default : typeToValue(schema.schema[key].type);
    }
    obj[key] = val;
  });

  if (keysOnly) {
    const keysArray = Object.keys(obj);
    Object.keys(nestedKeys).forEach((nestedKey) => {
      const idx = keysArray.indexOf(nestedKey);
      const nestedKeyString = `${nestedKey}: { ${nestedKeys[nestedKey].join(', ')} }`;
      keysArray[idx] = nestedKeyString;
    });
    return keysArray.join(', ');
  }
  return stringify ? JSON.stringify(obj) : obj;
};
