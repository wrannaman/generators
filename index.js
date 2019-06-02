#!/usr/bin/env node
'use strict';

const path = require('path');
const {
  makeSchema,
  makeConnection,
  makeConfig,
  makeModelIndex
} = require('./utils');
const { ArgumentParser } = require('argparse');

const parser = new ArgumentParser({
  version: '0.0.1',
  addHelp:true,
  description: 'Sugar Generator',
});

parser.addArgument(
  [ '-t', '--type' ],
  {
    help: 'one of ["api", "component"]',
    choices: ["api", "component"],
    required: true,
    metavar: "Generator Type",
    dest: "type"
  }
);

parser.addArgument(
  [ '-n', '--name' ],
  {
    help: 'api name',
    required: true,
    metavar: "Name",
    dest: "name"
  }
);

parser.addArgument(
  [ '-s', '--schema' ],
  {
    help: 'path to JSON of mongodb schema',
    required: true,
    metavar: "Schema",
    dest: "schema"
  }
);

parser.addArgument(
  [ '-l', '--log' ],
  {
    help: 'logging',
    choices: [true, false],
    metavar: "logging",
    dest: "logging",
    defaultValue: true,
  }
);

const args = parser.parseArgs();

args.schema =  path.join(__dirname, args.schema);
args.destination = __dirname;

const letzGetIt = async () => {
  await makeConfig(args);
  await makeConnection(args);
  await makeSchema(args);
  await makeModelIndex(args);
  if (args.logging) console.log('all done 🚀');
}

letzGetIt();
