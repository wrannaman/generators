const fs = require('fs');
const beautify = require('js-beautify').js;
const{ uppercase } = require('../utils');
const getGraphqlSchema = require('./getGraphqlSchema');

module.exports = ({ schema, destination, flavor, name }) => {
  schema = require(schema).schema;  // eslint-disable-line
  const modelFolder = `${destination}/graphql`;
  const indexFile = `${modelFolder}/typeDefs.js`;
  const code = `
  module.exports = [
    \`
    type Query {
      ${name}(_id: String): ${uppercase(name)}
      ${name}s: [${uppercase(name)}]
    }
    type ${uppercase(name)} {
      _id: String
      ${getGraphqlSchema(schema, 'column')}
    }
    type Mutation {
      create${uppercase(name)}(${getGraphqlSchema(schema, 'csv')}): ${uppercase(name)}
      update${uppercase(name)}(${name}ID: String, ${getGraphqlSchema(schema, 'csv')}): ${uppercase(name)}
      delete${uppercase(name)}(${name}ID: String): ${uppercase(name)}
    }
    schema {
      query: Query
      mutation: Mutation
    }
  \`
  ];

  `

  // if (logging) console.log('checking user-can');
  if (!fs.existsSync(modelFolder)) {
    // if (logging) console.log('creating user-can');
    fs.mkdirSync(modelFolder);
  }
  console.log('create index');
  const pretty = beautify(code, { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(indexFile, pretty);
};
