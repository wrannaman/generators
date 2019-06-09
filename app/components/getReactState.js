const typeToValue = require('./typeToValue');

module.exports = (schema, stringify = false, keysOnly = false) => {
  const obj = {};
  const nestedKeys = {};
  Object.keys(schema.schema).forEach((key) => {
    let val = "";
    if (!schema.schema[key].type) {
      val = {};
      Object.keys(schema.schema[key]).forEach((_key) => {
        val[_key] = schema.schema[key][_key].default ? schema.schema[key][_key].default : typeToValue(schema.schema[key][_key].type);
        if (!nestedKeys[key]) nestedKeys[key] = [];
        nestedKeys[key].push(_key);
      });
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
