const { makeConfig } = require('./config');
const { makeSwaggerModelDefinitions } = require('./swagger');
const { makeRouter } = require('./router');
const mkdirp = require('mkdirp');
const fs = require('fs');

const {
  serverIndex,
  // userCan,
  dockerFile,
  writePackageJSON,
  writeEslint,
  writeDockerIgnore,
  writeGitIgnore,
  readme
} = require('./server');
const {
  makeConnection,
  makeSchema,
  makeModelIndex,
} = require('./mongodb');
const {
  makeTests
} = require('./tests');

const { makeAPI } = require('./controller');

module.exports = async (args) => {
  if (!fs.existsSync(args.destination)) {
    mkdirp.sync(args.destination);
  } else if (process.env.NODE_ENV !== 'dev') {
     return console.log(`uh oh, looks like there's something already at ${args.destination}`); // eslint-disable-line
  }
  await makeConfig(args);
  await makeConnection(args);
  await makeSchema(args);
  await makeModelIndex(args);
  await makeAPI(args);
  await makeSwaggerModelDefinitions(args);
  await makeRouter(args);
  await serverIndex(args);
  // await userCan(args);
  await dockerFile(args);
  await writePackageJSON(args);
  await writeEslint(args);
  await writeGitIgnore(args);
  await writeDockerIgnore(args);
  await readme(args);
  await makeTests(args);
  if (args.logging) console.log('all done 🚀'); // eslint-disable-line
};
