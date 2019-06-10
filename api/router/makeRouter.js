const fs = require('fs');

module.exports = ({ schema, destination, name }) => {
  const indexCode = require('./indexCode');
  const routerCode = require('./routerCode');

  const modelFolder = `${destination}/router`;
  const indexFile = `${modelFolder}/index.js`;

  schema = require(schema); // eslint-disable-line
  const isArray = Array.isArray(schema);


  if (!fs.existsSync(modelFolder)) {
    fs.mkdirSync(modelFolder);
  }

  if (isArray) {
    const names = [];
    schema.forEach((s) => {
      names.push(s.name);
      const routerFile = `${modelFolder}/${s.name}.js`;
      fs.writeFileSync(routerFile, routerCode({ name: s.name }));
    });
    fs.writeFileSync(indexFile, indexCode({ names }));
  } else {
    const routerFile = `${modelFolder}/${schema.name}.js`;
    console.log('ROUTERFILE', routerFile)
    fs.writeFileSync(routerFile, routerCode({ name: schema.name }));
    fs.writeFileSync(indexFile, indexCode({ names: [schema.name] }));
  }
  // @TODO redis?
  // if (!fs.existsSync(redisFile)) {
  //   if (logging) console.log('creating redis connection');
  //   fs.writeFileSync(redisFile, connectionRedis);
  // }
};
