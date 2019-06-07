const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = ({ destination, logging }) => {
  const modelFolder = `${destination}`;
  const dockerFile = `${modelFolder}/Dockerfile`;
  const dockerIgnore = `${modelFolder}/.dockerignore`;

  // if (logging) console.log('checking Dockerfile');

  const code = `
FROM node:alpine
RUN mkdir -p /var/app
WORKDIR /var/app
COPY . /var/app
RUN npm install --production
RUN npm run docs
EXPOSE 7777
CMD [ "npm", "start" ]
  `;
  fs.writeFileSync(dockerFile, code);
  fs.writeFileSync(dockerIgnore, `
    node_modules
  `);
};
