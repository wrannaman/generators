const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = async (fileName) => {
  fileName = `${fileName}/package.json`;
  const code = `
  {
    "name": "app",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "dev": "next",
      "build": "next build",
      "start": "next start",
      "start-prod": "next start -p \${PORT}"
    },
    "author": "",
    "license": "",
    "dependencies": {
      "@material-ui/core": "^4.0.2",
      "@material-ui/icons": "^4.0.1",
      "@material-ui/styles": "^4.0.2",
      "clsx": "^1.0.4",
      "isomorphic-unfetch": "^3.0.0",
      "material-table": "^1.39.0",
      "next": "^8.1.0",
      "prop-types": "^15.7.2",
      "query-string": "^6.7.0",
      "react": "^16.8.6",
      "react-dom": "^16.8.6"
    }
  }
  `;
  const pretty = beautify(code, { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(fileName, pretty);
};
