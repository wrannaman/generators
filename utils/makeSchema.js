const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = ({ schema, logging, destination, name }) => {
  schema = require(schema);
  const modelFolder = `${destination}/models`;
  const modelFile = `${modelFolder}/${name}.js`;
  const indexFile = `${modelFolder}/index.js`;
  if (logging) console.log('making schema ', schema);

  if (!fs.existsSync(modelFolder)) {
    if (logging) console.log('creating models/');
    fs.mkdirSync(modelFolder);
  }

  let code = [
    "const database = require('../connection/mongo');",
    "const { Schema } = require('mongoose');",
    "const mongoosePaginate = require('mongoose-paginate-v2');",
    "const schema = new Schema({",
  ];

  // format the model
  Object.keys(schema.schema).forEach(key => {
    let value = JSON.stringify(schema.schema[key]);
    value = value.replace('"String"', "String");
    value = value.replace('"string"', "String");
    value = value.replace('"boolean"', "Boolean");
    value = value.replace('"Boolean"', "Boolean");
    value = value.replace('"Number"', "Number");
    value = value.replace('"number"', "Number");
    value = value.replace('"ObjectId"', "Schema.Types.ObjectId");
    code.push(`  ${key}: ${value},`)
  });
  // add timestamps
  code.push(`},
  {
    timestamps: true
  });`);
  // assign statics
  const statics = []
  Object.keys(schema.statics).forEach(key => {
    statics.push(`schema.statics.${key} = ${JSON.stringify(schema.statics[key])};`);
  });
  statics.forEach((static) => code.push(`${static}`))

  // button up
  code.push(`schema.plugin(mongoosePaginate);`)
  code.push(`module.exports = database.model("${name}", schema);`)
  const pretty = beautify(code.join('\n'), { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(modelFile, pretty);
}
