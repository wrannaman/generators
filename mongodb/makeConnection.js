const fs = require('fs');
const { connectionIndex, connectionMongo, connectionRedis } = require('../code');

module.exports = ({ schema, logging, destination }) => {
  schema = require(schema);
  const modelFolder = `${destination}/connection`;
  const mongoFile = `${modelFolder}/mongo.js`;
  const redisFile = `${modelFolder}/redis.js`;
  const indexFile = `${modelFolder}/index.js`;

  if (logging) console.log('checking connection ');

  if (!fs.existsSync(modelFolder)) {
    if (logging) console.log('creating connection/mongo.js');
    fs.mkdirSync(modelFolder);
  }
  if (!fs.existsSync(indexFile)) {
    if (logging) console.log('creating connection/index.js');
    fs.writeFileSync(indexFile, connectionIndex);
  }
  if (!fs.existsSync(mongoFile)) {
    if (logging) console.log('creating mongoDB connection');
    fs.writeFileSync(mongoFile, connectionMongo);
  }
  if (!fs.existsSync(redisFile)) {
    if (logging) console.log('creating redis connection');
    fs.writeFileSync(redisFile, connectionRedis);
  }
}
