const mkdirp = require('mkdirp');
const fs = require('fs');

const makeStatics = require('./statics/makeStatics');
const makeSrc = require('./src/makeSrc');
const makePages = require('./pages/makePages');
const makeComponents = require("./components/makeComponents");

module.exports = async (args) => {
  if (process.env.NODE_ENV !== 'dev' && fs.existsSync(args.destination)) return console.log(`uh oh, looks like there's something already at ${args.destination}`); // eslint-disable-line
  mkdirp.sync(args.destination);
  mkdirp.sync(`${args.destination}/src`);
  mkdirp.sync(`${args.destination}/pages`);
  mkdirp.sync(`${args.destination}/components`);
  console.log('APP => Statics'); // eslint-disable-line
  await makeStatics(args.destination);
  await makeSrc(args.destination);
  await makePages(args);
  await makeComponents(args);
};
