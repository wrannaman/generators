const fs = require('fs');

module.exports = ({ schema, logging, destination, name }) => {
  const indexCode = require('./indexCode');
  const routerCode = require('./routerCode');
  schema = require(schema); // eslint-disable-line
  console.log('SCHEMA', schema)
  const modelFolder = `${destination}/router`;
  const routerFile = `${modelFolder}/${name}.js`;
  const indexFile = `${modelFolder}/index.js`;

  if (logging) console.log('checking connection ');

  if (!fs.existsSync(modelFolder)) {
    if (logging) console.log('creating router folder');
    fs.mkdirSync(modelFolder);
  }

  // if (!fs.existsSync(indexFile)) {
    if (logging) console.log('creating connection/index.js');
    fs.writeFileSync(indexFile, indexCode({ name }));
  // }
  // if (!fs.existsSync(mongoFile)) {
    if (logging) console.log('creating mongoDB connection');
    fs.writeFileSync(routerFile, routerCode({ name }));
  // }
  // if (!fs.existsSync(redisFile)) {
  //   if (logging) console.log('creating redis connection');
  //   fs.writeFileSync(redisFile, connectionRedis);
  // }
}
