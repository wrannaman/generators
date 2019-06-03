const fs = require('fs');
const { schemaDefinition } = require('../swagger');

module.exports = ({ schema, logging, destination, name }) => {
  const swaggerFile = `${destination}/swagger.yaml`;
  const top = `
  openapi: 3.0.0
  info:
    title: Generated API
    description: ap generated api
    version: 0.0.1
  servers:
    - url: http://localhost:3000
      description: local
    - url: http://staging-api.example.com
      description: Optional server description, e.g. Internal staging server for testing
  components:
    schemas:
`;
  const code = [top];
  code.push(schemaDefinition({ schema, name }));
  if (logging) console.log('make swagger model definitions ');
  fs.writeFileSync(swaggerFile, code.join('\n'));
};
