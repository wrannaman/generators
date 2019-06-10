const babel = require('./babelrc');
const git = require('./gitignore');
const next = require('./next-config');
const pack = require('./package');
const readme = require('./readme');
const config = require('./config');
const dockerfile = require('./dockerfile');

module.exports = async (dest) => {
  babel(dest);
  git(dest);
  next(dest);
  pack(dest);
  readme(dest);
  config(dest);
  dockerfile(dest);
};
