const fs = require('fs');
// const beautify = require('js-beautify').js;

module.exports = ({ destination, flavor }) => {
  const modelFolder = `${destination}`;
  const indexFile = `${modelFolder}/package.json`;
  const code = require('./package.json');
  if (flavor !== 'graphql') {
    delete code.dependencies.graphql;
    delete code.dependencies["graphql-server-express"];
    delete code.dependencies["express-graphql"];
  }
  // if (logging) console.log('checking server index ');
  // if (logging) console.log('creating server entrypoint');
  fs.writeFileSync(indexFile, JSON.stringify(code, null, 2));
};
