const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = ({ destination, logging, name }) => {
  const modelFolder = `${destination}`;
  const indexFile = `${modelFolder}/README.md`;
  const code = `
# Generated API for ${name}

- auto generated OAS 3.0.0 compliant api 

## Run

\`\`\`sh
npm start
\`\`\`

## Build

\`\`\`sh
docker build -t container-name:0.0.1 .
\`\`\`

## Documentation

- Documenation is auto generated and is available via swagger at [http://localhost:3000](http://localhost:3000)

\`\`\`sh
npm run docs
\`\`\`

## Configs

configs are located at **configs/configs.json**

\`\`\`json
{
  "port": 7777,
  "db": {
    "mongoURL": "mongodb://localhost:27017/sugar",
    "mongoOptions": {
      "useNewUrlParser": true
    }
  },
  "redisConfig": {
    "host": "localhost",
    "port": 6379,
    "password": ""
  },
  "jwt_secret": "e4b717984dab52c8168f5b61bbb8bea42acfe921",
  "basicAuth": {
    "username": "sugar",
    "password": "kubes"
  },
  "env": "local",
  "userCanApiKey": "123456"
}
\`\`\`


  `;
  fs.writeFileSync(indexFile, code);
};
