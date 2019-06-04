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
} = require('./utils');

const { makeRouter } = require('./router');
const {
  serverIndex,
  userCan,
  dockerFile,
  writePackageJSON,
  writeEslint,
  readme
} = require('./server');
const {
  makeConnection,
} = require('./mongodb');
const {
  makeTests
} = require('./tests');

const { makeAPI } = require('./controller');

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
  if (!fs.existsSync(args.destination)) mkdirp.sync(args.destination);
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
  await readme(args);
  await makeTests(args);
  if (args.logging) console.log('all done 🚀');
};

const validSchema = validateSchema(args.schema);

if (validSchema) {
  letzGetIt();
} else {
  console.error('Error => invalid schema.');
}
