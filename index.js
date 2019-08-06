#!/usr/bin/env node
const path = require('path');
const { ArgumentParser } = require('argparse');
const { validateSchema } = require('./api/utils');
const makeAPI = require('./api/makeAPI');
const makeApp = require('./app/makeApp');
const makeEmbeddable = require('./embeddable/makeEmbeddable');

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
  ['-o', '--output'],
  {
    help: 'where will the generated code go?',
    metavar: "output",
    dest: "destination",
    // defaultValue: __dirname,
  }
);

const args = parser.parseArgs();
console.log('ARGS', args)

args.schema = path.join(process.cwd(), args.schema);
args.destination = path.join(process.cwd(), args.destination);

const validSchema = validateSchema(args.schema);

if (validSchema === true) {
  makeAPI(Object.assign({}, args, { destination: `${args.destination}/api` }));
  makeApp(Object.assign({}, args, { destination: `${args.destination}/app` }));
  // makeEmbeddable(Object.assign({}, args, { destination: `${args.destination}/embeddable` }));
  console.log('not making embeddable');
} else {
  console.error('Error => invalid schema.', validSchema === false ? '' : validSchema);
}
