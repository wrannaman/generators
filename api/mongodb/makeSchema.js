const fs = require('fs');
const beautify = require('js-beautify').js;

const replaceStringValues = (str) => {
  str = str.replace(/"String"/g, "String");
  str = str.replace(/"string"/g, "String");
  str = str.replace(/"boolean"/g, "Boolean");
  str = str.replace(/"Boolean"/g, "Boolean");
  str = str.replace(/"Number"/g, "Number");
  str = str.replace(/"number"/g, "Number");
  str = str.replace(/"ObjectId"/g, "Schema.Types.ObjectId");
  str = str.replace(/"default"/g, "default");
  str = str.replace(/"type"/g, "type");
  str = str.replace(/"htmlType"/g, "htmlType");
  str = str.replace(/"unique"/g, "unique");
  str = str.replace(/"trim"/g, "trim");
  str = str.replace(/"required"/g, "required");
  str = str.replace(/"immutable"/g, "immutable");
  str = str.replace(/"enum"/g, "enum");

  return str;
};

const doMakeSchema = ({ schema, destination }) => {
  const { uppercase } = require('../utils');
  const name = schema.name;
  const modelFolder = `${destination}/models`;
  const modelFile = `${modelFolder}/${uppercase(name)}.js`;
  // if (logging) console.log('making schema ', schema);

  if (!fs.existsSync(modelFolder)) {
    // if (logging) console.log('creating models/');
    fs.mkdirSync(modelFolder);
  }

  const code = [
    "const database = require('../connection/mongo');",
    "const { Schema } = require('mongoose');",
    "const mongoosePaginate = require('mongoose-paginate-v2');",
    "const schema = new Schema({",
  ];

  // format the model
  Object.keys(schema.schema).forEach(key => {
    let value = schema.schema[key];
    if (schema.schema[key].type) {
      value = JSON.stringify(schema.schema[key]);
      value = replaceStringValues(value);
      code.push(`  ${key}: ${value},`);
    } else if (Array.isArray(schema.schema[key])) {
      code.push(`  ${key}: [`);
      schema.schema[key].forEach((item) => {
        if (item.type) {
          value = JSON.stringify(item);
          value = replaceStringValues(value);
          code.push(`${value}`);
        } else {
          let _value = "{}";
          Object.keys(item).forEach(_key => {
            code.push(`{ ${_key}: `);
            _value = JSON.stringify(item[_key]);
            _value = replaceStringValues(_value);
            code.push(`${_value}, }`);
          });
        }
      });
      code.push(`  ],`);
    } else {
      code.push(`  ${key}: {`);
      let _value = {};
      Object.keys(schema.schema[key]).forEach(_key => {
        _value = JSON.stringify(schema.schema[key][_key]);
        _value = replaceStringValues(_value);
        code.push(`  ${_key}: ${_value},`);
      });
      code.push(`},`);
    }
  });
  // add timestamps
  code.push(`},
  {
    timestamps: true
  });`);
  // assign statics
  if (schema.statics) {
    const statics = [];
    Object.keys(schema.statics).forEach(key => {
      statics.push(`schema.statics.${key} = ${JSON.stringify(schema.statics[key])};`);
    });
    statics.forEach((_static) => code.push(`${_static}`));
  }

  // button up
  code.push(`schema.plugin(mongoosePaginate);`);
  code.push(`module.exports = database.model("${uppercase(name)}", schema);`);
  const pretty = beautify(code.join('\n'), { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(modelFile, pretty);
};

module.exports = ({ schema, destination}) => {
  schema = require(schema); // eslint-disable-line
  if (Array.isArray(schema)) {
    schema.forEach((_schema) => doMakeSchema({ schema: _schema, destination }));
  } else {
    doMakeSchema({ schema, destination });
  }
};
