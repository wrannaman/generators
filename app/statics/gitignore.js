const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = async (fileName) => {
  fileName = `${fileName}/.gitignore`;
  const code = `# See https://help.github.com/ignore-files/ for more about ignoring files.
# dependencies
/node_modules

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Next.js
/.next`;
  const pretty = beautify(code, { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(fileName, pretty);
};
