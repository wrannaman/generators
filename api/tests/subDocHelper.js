
module.exports = (obj) => {
  const genData = require('./genData');
  if (!obj) throw new Error('subdocument is undefined');
  const fake = {};
  Object.keys(obj).forEach(key => {
    fake[key] = genData(obj[key].type);
  });
  return fake;
};
