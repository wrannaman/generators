const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = ({ destination, logging, }) => {
  const modelFolder = `${destination}/user-can`;
  const indexFile = `${modelFolder}/index.js`;

  // if (logging) console.log('checking user-can');
  if (!fs.existsSync(modelFolder)) {
    // if (logging) console.log('creating user-can');
    fs.mkdirSync(modelFolder);
  }

  const code = [];
  code.push(`
    module.exports = (apiKey) => (params) => {
      // console.log('user can ', params);

      // @TODO make api call to userCan.sugarkubes.io and of course build the service.

      return true;
    };
  `);
  // if (logging) console.log('creating server entrypoint');
  const pretty = beautify(code.join('\n'), { indent_size: 2, space_in_empty_paren: true });

  fs.writeFileSync(indexFile, pretty);
}
