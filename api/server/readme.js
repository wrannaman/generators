const fs = require('fs');

module.exports = ({ schema, destination }) => {
  const { uppercase } = require('../utils');
  const modelFolder = `${destination}`;
  const indexFile = `${modelFolder}/README.md`;
  schema = require(schema); // eslint-disable-line

  const isArray = Array.isArray(schema);

  const names = [];
  if (isArray) {
    schema.forEach((s) => names.push(uppercase(s.name)));
  } else {
    names.push(schema.name);
  }
  const code = `
# Generated API for ${names.join(', ')}

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
  "env": "local",
  "userCanApiKey": "123456"
}
\`\`\`


  `;

  // to be added to configs json
  //  "jwt_secret": "e4b717984dab52c8168f5b61bbb8bea42acfe921",
  // "basicAuth": {
  //   "username": "sugar",
  //   "password": "kubes"
  // },
  // "redisConfig": {
  //   "host": "localhost",
  //   "port": 6379,
  //   "password": ""
  // },
  //
  fs.writeFileSync(indexFile, code);
};
