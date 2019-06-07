const fs = require('fs');
const { schemaDefinition } = require('../swagger');

module.exports = ({ schema, logging, destination, name }) => {
  const uppercase = require('./uppercase');
  const swaggerFile = `${destination}/swagger.yaml`;
  const top = `
  openapi: 3.0.0
  info:
    title: ${uppercase(name)} API
    description: Generated API for ${uppercase(name)} model
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
  code.push(schemaDefinition({ schema, name }));
  // if (logging) console.log('make swagger model definitions ');
  fs.writeFileSync(swaggerFile, code.join('\n'));
};
