module.exports = (str) => {
  if (str === 'objectid' || str === 'ObjectId') return 'string # ObjectId';
  if (typeof str === 'undefined') return 'object';
  return str;
};
