const fs = require('fs');
const { connectionIndex, connectionMongo } = require('../code');

module.exports = ({ schema, logging, destination }) => {
  schema = require(schema);
  const modelFolder = `${destination}/connection`;
  const mongoFile = `${modelFolder}/mongo.js`;
  const indexFile = `${modelFolder}/index.js`;

  if (logging) console.log('checking connection ');

  if (!fs.existsSync(modelFolder)) {
    if (logging) console.log('creating folder', modelFolder);
    fs.mkdirSync(modelFolder);
  }
  if (!fs.existsSync(indexFile)) {
    if (logging) console.log('creating indexFile', indexFile);
    fs.writeFileSync(indexFile, connectionIndex);
  }

  if (!fs.existsSync(mongoFile)) {
    if (logging) console.log('creating mongo db connection', indexFile);
    fs.writeFileSync(mongoFile, connectionMongo);
  }
}
