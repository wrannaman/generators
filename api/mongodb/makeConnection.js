const fs = require('fs');

const connectionIndex = require('./connectionIndex');
const connectionMongo = require('./connectionMongo');
const connectionRedis = require('../redis/connectionRedis');

module.exports = ({ schema, logging, destination }) => {
  schema = require(schema); // eslint-disable-line
  const modelFolder = `${destination}/connection`;
  const mongoFile = `${modelFolder}/mongo.js`;
  const redisFile = `${modelFolder}/redis.js`;
  const indexFile = `${modelFolder}/index.js`;

  // if (logging) console.log('checking connection ');
  // if (logging) console.log('creating connection/mongo.js');
  if (!fs.existsSync(redisFile)) {
    // if (logging) console.log('creating connection/mongo.js');
    fs.mkdirSync(modelFolder);
  }

  // if (logging) console.log('creating connection/index.js');
  fs.writeFileSync(indexFile, connectionIndex);

  // if (logging) console.log('creating mongoDB connection');
  fs.writeFileSync(mongoFile, connectionMongo);

  // if (logging) console.log('creating redis connection');
  fs.writeFileSync(redisFile, connectionRedis);

  // if (!fs.existsSync(redisFile)) {
  //
  // }
}
