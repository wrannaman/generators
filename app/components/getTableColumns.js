const typeToValue = require('./typeToValue');
const { uppercase } = require('../../api/utils');


const tableColumnsByType = (_type, schema, k, _title = "") => {
  let type = 'string';
  switch (_type) {
    case 'Number':
      type = 'numeric';
      break;
    case 'Boolean':
      type = 'boolean';
      break;
    default:

  }
  let title = _title ? _title : uppercase(String(k));
  if (schema.schema[k].required) title += '*';
  const obj = {
    title,
    field: k,
    type,
    editable: schema.schema[k].unique ? 'always' : 'never'
    // customFilterAndSearch: "this.customFilterAndSearch",
  };
  // if (schema.schema[k].default) {
  //   obj.emptyValue = schema.schema[k].default;
  // }
  if (schema.schema[k].enum) {
    obj.lookup = {};
    schema.schema[k].enum.forEach(item => obj.lookup[item] = uppercase(item));
  }
  return obj;
};

module.exports = (schema, stringify = false, keysOnly = false) => {
  const columns = [];
  const keys = Object.keys(schema.schema);
  keys.forEach((k) => {
    const _type = schema.schema[k].type;
    if (_type) {
      const obj = tableColumnsByType(_type, schema, k);
      columns.push(obj);
    } else if (Array.isArray(schema.schema[k])) {
      schema.schema[k].forEach((item, idx) => {
        if (item.type) {
          const obj = tableColumnsByType(item.type, schema, `${k}`);
          columns.push(obj);
        } else {
          Object.keys(item).forEach((subKey) => {
            const obj = tableColumnsByType(item[subKey].type, { schema: item }, subKey, `${k} - ${subKey}`);
            columns.push(obj);
          });
        }
      });
    } else {
      Object.keys(schema.schema[k]).forEach((_key) => {
        const _subType = schema.schema[k][_key].type;
        let subType = 'string';
        switch (_subType) {
          case 'Number':
            subType = 'numeric';
            break;
          default:
        }

        let _title = `${uppercase(k)} ${uppercase(_key)}`;
        if (schema.schema[k][_key].required) _title += '*';
        const _obj = {
          title: _title,
          field: `${k}.${_key}`,
          type: subType,
          readonly: schema.schema[k][_key].unique ? true : false,
          // customFilterAndSearch: "this.customFilterAndSearch",
        };
        // if (schema.schema[k][_key].default) {
        //   _obj.emptyValue = schema.schema[k].default;
        // }
        columns.push(_obj);
      });
    }
  });
  // [
  //   { title: "Adı", field: "name" },
  //   { title: "Soyadı", field: "surname" },
  //   { title: "Doğum Yılı", field: "birthYear", type: "numeric" },
  //   {
  //     title: "Doğum Yeri",
  //     field: "birthCity",
  //     lookup: { 34: "İstanbul", 63: "Şanlıurfa" }
  //   }
  // ]
  return JSON.stringify(columns);
};
