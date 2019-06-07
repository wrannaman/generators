const createIndex = require('./createIndex');
const createResolvers = require('./createResolvers');
module.exports = async (args) => {
  await createIndex(args);
  await createResolvers(args);
};
