const createIndex = require('./createIndex');
const createResolvers = require('./createResolvers');
const createTypeDefs = require('./createTypeDefs');

module.exports = async (args) => {
  await createIndex(args);
  await createResolvers(args);
  await createTypeDefs(args);
};
