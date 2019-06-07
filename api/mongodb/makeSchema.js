const fs = require('fs');
const beautify = require('js-beautify').js;


const doMakeSchema = ({ schema, destination }) => {
  const { uppercase } = require('../utils');
  const name = schema.name;
  console.log('up ', uppercase(name));
  console.log('NAME', name)
  const modelFolder = `${destination}/models`;
  const modelFile = `${modelFolder}/${uppercase(name)}.js`;
  const indexFile = `${modelFolder}/index.js`;
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
    let value = JSON.stringify(schema.schema[key]);
    console.log('VALUE', value)
    value = value.replace(/"String"/g, "String");
    value = value.replace(/"string"/g, "String");
    value = value.replace(/"boolean"/g, "Boolean");
    value = value.replace(/"Boolean"/g, "Boolean");
    value = value.replace(/"Number"/g, "Number");
    value = value.replace(/"number"/g, "Number");
    value = value.replace(/"ObjectId"/g, "Schema.Types.ObjectId");
    code.push(`  ${key}: ${value},`)
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
}


module.exports = ({ schema, destination}) => {
  schema = require(schema); // eslint-disable-line
  if (Array.isArray(schema)) {
    schema.forEach((_schema) => doMakeSchema({ schema: _schema, destination }));
  } else {
    doMakeSchema({ schema, destination });
  }
};
