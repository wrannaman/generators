const fs = require('fs');
const schemaDefinition = require('./schemaDefinition');

module.exports = ({ schema, logging, destination }) => {
  schema = require(schema); // eslint-disable-line
  const uppercase = require('../utils/uppercase');
  const swaggerFile = `${destination}/swagger.yaml`;
  let names = "";
  const isArray = Array.isArray(schema);

  if (isArray) {
    schema.forEach((s, i) => names += `${uppercase(s.name)}${i < schema.length - 1 ? ', ' : '.'}`);
  } else {
    names = uppercase(schema.name);
  }

  const top = `
  openapi: 3.0.0
  info:
    title: ${names} API
    description: Generated API for ${names}
    version: 0.0.1
  servers:
    - url: http://localhost:7777
      description: local7777
    - url: https://sugar-generate-demo-iqwznvcybq-uc.a.run.app
      description: test
    - url: http://localhost:3000
      description: local3000
  components:
    schemas:
`;
  const code = [top];

  if (isArray) {
    schema.forEach((s) => code.push(schemaDefinition({ schema: s, name: s.name })));
  } else {
    code.push(schemaDefinition({ schema, name: schema.name }));
  }
  // if (logging) console.log('make swagger model definitions ');
  fs.writeFileSync(swaggerFile, code.join('\n'));
};
