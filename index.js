#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { ArgumentParser } = require('argparse');
const mkdirp = require('mkdirp');

const {
  makeSchema,
  makeConfig,
  makeModelIndex,
  makeSwaggerModelDefinitions,
  validateSchema,
} = require('./api/utils');

const { makeRouter } = require('./api/router');
const {
  serverIndex,
  userCan,
  dockerFile,
  writePackageJSON,
  writeEslint,
  writeDockerIgnore,
  writeGitIgnore,
  readme
} = require('./api/server');
const {
  makeConnection,
} = require('./api/mongodb');
const {
  makeTests
} = require('./api/tests');

const {
  makeGraphql
} = require('./api/graphql');

const { makeAPI } = require('./api/controller');

const parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Sugar Generator',
});

parser.addArgument(
  ['-t', '--type'],
  {
    help: 'one of ["api", "component"]',
    choices: ["api", "component"],
    required: true,
    metavar: "Generator Type",
    dest: "type"
  }
);

parser.addArgument(
  ['-f', '--flavor'],
  {
    help: 'one of ["graphql", "rest"]',
    choices: ["rest", "graphql"],
    required: false,
    metavar: "flavor. do you want just rest or graphql + rest?",
    dest: "flavor",
    defaultValue: "graphql",
  }
);

parser.addArgument(
  ['-n', '--name'],
  {
    help: 'api name',
    required: true,
    metavar: "Name",
    dest: "name"
  }
);

parser.addArgument(
  ['-s', '--schema'],
  {
    help: 'path to JSON of mongodb schema',
    required: true,
    metavar: "Schema",
    dest: "schema"
  }
);

parser.addArgument(
  ['-l', '--log'],
  {
    help: 'logging',
    choices: [true, false],
    metavar: "logging",
    dest: "logging",
    defaultValue: true,
  }
);

parser.addArgument(
  ['-d', '--destination'],
  {
    help: 'destination',
    metavar: "destination",
    dest: "destination",
    defaultValue: __dirname,
  }
);

const args = parser.parseArgs();

args.schema = path.join(__dirname, args.schema);
args.destination = args.destination;

const letzGetIt = async () => {
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
  await userCan(args);
  await dockerFile(args);
  await writePackageJSON(args);
  await writeEslint(args);
  await writeGitIgnore(args);
  await writeDockerIgnore(args);
  await readme(args);
  await makeTests(args);
  if (args.flavor === 'graphql') {
    await makeGraphql(args);
  }
  if (args.logging) console.log('all done 🚀'); // eslint-disable-line
};

const validSchema = validateSchema(args.schema);

if (validSchema) {
  letzGetIt();
} else {
  console.error('Error => invalid schema.');
}
