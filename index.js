#!/usr/bin/env node
const path = require('path');
const { ArgumentParser } = require('argparse');
const { validateSchema } = require('./api/utils');
const makeApi = require('./api/makeAPI');
const makeApp = require('./app/makeApp');

const parser = new ArgumentParser({
  version: require('./package.json').version,
  addHelp: true,
  description: 'Sugar Generator',
});

parser.addArgument(
  ['-t', '--type'],
  {
    help: 'one of ["api", "component"]',
    choices: ["api", "component"],
    metavar: "Generator Type",
    dest: "type",
    defaultValue: "api",
    required: false,
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
  ['-l', '--log'],
  {
    help: 'logging',
    choices: [true, false],
    metavar: "logging",
    dest: "logging",
    defaultValue: true,
  }
);

// required

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
  ['-d', '--destination'],
  {
    help: 'destination',
    metavar: "destination",
    dest: "destination",
    defaultValue: __dirname,
  }
);

const args = parser.parseArgs();

args.schema = path.join(process.cwd(), args.schema);
args.destination = args.destination;

const validSchema = validateSchema(args.schema);

if (validSchema) {
  makeApi(Object.assign({}, args, { destination: `${args.destination}/api` }));
  makeApp(Object.assign({}, args, { destination: `${args.destination}/app` }));
} else {
  console.error('Error => invalid schema.');
}
