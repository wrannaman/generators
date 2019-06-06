const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = ({ destination, flavor }) => {
  const modelFolder = `${destination}/graphql`;
  const indexFile = `${modelFolder}/index.js`;
  const code = `
    module.exports = {
      typeDefs: require('./typeDefs'),
      resolvers: require('./resolvers'),
      prepare: require('./prepare'),
    };
  `;

  // if (logging) console.log('checking user-can');
  if (!fs.existsSync(modelFolder)) {
    // if (logging) console.log('creating user-can');
    fs.mkdirSync(modelFolder);
  }
  const pretty = beautify(code, { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(indexFile, pretty);
};
