const fs = require('fs');
const beautify = require('js-beautify').js;
const { uppercase } = require('../utils');
const { tcString } = require('../graphql');

module.exports = ({ schema, destination, logging, flavor }) => {
  schema = require(schema); // eslint-disable-line

  const isArray = Array.isArray(schema);

  const names = [];
  if (isArray) {
    schema.forEach((s) => names.push(uppercase(s.name)));
  } else {
    names.push(uppercase(schema.name));
  }
  const modelFolder = `${destination}`;
  const indexFile = `${modelFolder}/index.js`;
  // if (logging) console.log('checking server index ');
  const code = [];

  const graphql = [
    `
    // graphql
    const graphqlHTTP = require('express-graphql');
    const { composeWithMongoose } = require('graphql-compose-mongoose/node8');
    const { schemaComposer } = require('graphql-compose');
    const customizationOptions = {}; // left it empty for simplicity, described below
    const { ${names.join(', ')} } = require('./models');
    `
  ];


  names.forEach((name) => {
    graphql.push(`const ${uppercase(name)}TC = composeWithMongoose(${uppercase(name)}, customizationOptions);`);
  });

  graphql.push('schemaComposer.Query.addFields({');
  names.forEach((name) => {
    name = name.toLowerCase();
    graphql.push(`${name}ById: ${uppercase(name)}TC.getResolver('findById'),`);
    graphql.push(`${name}ByIds: ${uppercase(name)}TC.getResolver('findByIds'),`);
    graphql.push(`${name}One: ${uppercase(name)}TC.getResolver('findOne'),`);
    graphql.push(`${name}Many: ${uppercase(name)}TC.getResolver('findMany'),`);
    graphql.push(`${name}Count: ${uppercase(name)}TC.getResolver('count'),`);
    graphql.push(`${name}Connection: ${uppercase(name)}TC.getResolver('connection'),`);
    graphql.push(`${name}Pagination: ${uppercase(name)}TC.getResolver('pagination'),`);
  });
  graphql.push('  });');

  graphql.push('schemaComposer.Mutation.addFields({');
  names.forEach((name) => {
    name = name.toLowerCase();
    graphql.push(`${name}CreateOne: ${uppercase(name)}TC.getResolver('createOne'),`);
    graphql.push(`${name}CreateMany: ${uppercase(name)}TC.getResolver('createMany'),`);
    graphql.push(`${name}UpdateById: ${uppercase(name)}TC.getResolver('updateById'),`);
    graphql.push(`${name}UpdateOne: ${uppercase(name)}TC.getResolver('updateOne'),`);
    graphql.push(`${name}UpdateMany: ${uppercase(name)}TC.getResolver('updateMany'),`);
    graphql.push(`${name}RemoveById: ${uppercase(name)}TC.getResolver('removeById'),`);
    graphql.push(`${name}RemoveOne: ${uppercase(name)}TC.getResolver('removeOne'),`);
    graphql.push(`${name}RemoveMany: ${uppercase(name)}TC.getResolver('removeMany'),`);
  });
  graphql.push('});');
  graphql.push('const graphqlSchema = schemaComposer.buildSchema();');
  graphql.push(`
    app.use('/graphql', graphqlHTTP({
      schema: graphqlSchema,
      graphiql: true
    }));
  `);

  code.push(`
    const express = require('express');
    const fs = require('fs');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const swag = require('swagger-ui-dist');
    const db = require('./connection/mongo'); // eslint-disable-line
    let { port } = require('./configs/config');
    if (process.env.PORT) port = process.env.PORT;
    const abs = swag.getAbsoluteFSPath();
    const app = express();
    const jsonParser = bodyParser.json();
    app.use(cors());
    app.use(jsonParser);
    ${flavor !== 'graphql' ? '' : graphql.join('')}
    app.use((req, res, next) => {
      console.log(\`\${req.method} \${req.url}\`);
      return next();
    });
    app.use('/health', (req, res) => res.status(200).json({ healthy: true, time: new Date().getTime() }));

    // routes
  `);
  names.forEach((name) => {
    name = name.toLowerCase();
    code.push(`app.use([ require('./router/${name}') ]);`);
  });
  code.push('const indexContent = fs.readFileSync(`${abs}/index.html`).toString().replace("https://petstore.swagger.io/v2/swagger.json", `http://localhost:${port}/swagger.json`);'); // eslint-disable-line
  code.push("app.use('/swagger.json', express.static('./swagger.json'));");
  code.push('app.get("/", (req, res) => res.send(indexContent));');
  code.push('app.get("/index.html", (req, res) => res.send(indexContent));');
  code.push("app.use(express.static(abs));");
  code.push("app.listen(port, () => console.log(\`SugarKubes API: \${port}!\`)); // eslint-disable-line"); // eslint-disable-line
  code.push("module.exports = app; // for testing");
  // if (logging) console.log('creating server entrypoint');
  const pretty = beautify(code.join('\n'), { indent_size: 2, space_in_empty_paren: true });

  fs.writeFileSync(indexFile, pretty);
};
