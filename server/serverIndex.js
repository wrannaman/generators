const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = ({ destination, logging, name }) => {
  const modelFolder = `${destination}`;
  const indexFile = `${modelFolder}/index.js`;
  // if (logging) console.log('checking server index ');
  const code = [];
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
    app.use((req, res, next) => {
      console.log(\`\${req.method} \${req.url}\`);
      return next();
    });
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
  // if (logging) console.log('creating server entrypoint');
  const pretty = beautify(code.join('\n'), { indent_size: 2, space_in_empty_paren: true });

  fs.writeFileSync(indexFile, pretty);
}
