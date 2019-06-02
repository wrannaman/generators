const fs = require('fs');
const { config } = require('../code');

module.exports = ({ schema, logging, destination }) => {
  // schema = require(schema);
  const configsFolder = `${destination}/configs`;
  const file = `${configsFolder}/config.json`
  if (logging) console.log('checking configs ', schema);
  if (!fs.existsSync(configsFolder)) {
    if (logging) console.log('creating folder ', configsFolder);
    fs.mkdirSync(configsFolder);
  }
  if (!fs.existsSync(file)) {
    if (logging) console.log('creating ', file);
    fs.writeFileSync(file, JSON.stringify(config, null, 2));
  }
}
