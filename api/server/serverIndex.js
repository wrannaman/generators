const fs = require('fs');
const beautify = require('js-beautify').js;
const { uppercase } = require('../utils');

module.exports = ({ destination, logging, name, flavor }) => {
  const modelFolder = `${destination}`;
  const indexFile = `${modelFolder}/index.js`;
  // if (logging) console.log('checking server index ');
  const code = [];
  const graphql = `
  // graphql
  const graphqlHTTP = require('express-graphql');
  const { makeExecutableSchema } = require('graphql-tools');
  // const { typeDefs, resolvers } = require('./graphql');
  // const schema = makeExecutableSchema({ typeDefs, resolvers });
  // app.use('/graphql', graphqlHTTP({
  //   schema,
  //   graphiql: true
  // }));

  const { composeWithMongoose } = require('graphql-compose-mongoose/node8');
  const { schemaComposer } = require('graphql-compose');
  const customizationOptions = {}; // left it empty for simplicity, described below
  const ${uppercase(name)} = require('./models/${name}');
  const ${uppercase(name)}TC = composeWithMongoose(${uppercase(name)}, customizationOptions);

  schemaComposer.Query.addFields({
    ${name}ById: UserTC.getResolver('findById'),
    ${name}ByIds: UserTC.getResolver('findByIds'),
    ${name}One: UserTC.getResolver('findOne'),
    ${name}Many: UserTC.getResolver('findMany'),
    ${name}Count: UserTC.getResolver('count'),
    ${name}Connection: UserTC.getResolver('connection'),
    ${name}Pagination: UserTC.getResolver('pagination'),
  });

  schemaComposer.Mutation.addFields({
    ${name}CreateOne: UserTC.getResolver('createOne'),
    ${name}CreateMany: UserTC.getResolver('createMany'),
    ${name}UpdateById: UserTC.getResolver('updateById'),
    ${name}UpdateOne: UserTC.getResolver('updateOne'),
    ${name}UpdateMany: UserTC.getResolver('updateMany'),
    ${name}RemoveById: UserTC.getResolver('removeById'),
    ${name}RemoveOne: UserTC.getResolver('removeOne'),
    ${name}RemoveMany: UserTC.getResolver('removeMany'),
  });

  const graphqlSchema = schemaComposer.buildSchema();

  app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true
  }));
  `;
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
    ${flavor !== 'graphql' ? '' : graphql}
    // app.use((req, res, next) => {
    //   console.log(\`\${req.method} \${req.url}\`);
    //   return next();
    // });
    app.use('/health', (req, res) => res.status(200).json({ healthy: true, time: new Date().getTime() }));

    // routes
    app.use([ require('./router/${name}') ]);
  `);
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
}
