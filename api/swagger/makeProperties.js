module.exports = (params, space = '') => {
  const safeType = require('./safeType');
  const safeDefault = require('./safeDefault');
  const code = [];
  Object.keys(params).forEach(key => {
    code.push(`${space}${key}:`);
    code.push(`${space}  type: ${safeType(params[key].type)}`);
    if (typeof params[key].default !== 'undefined') code.push(`${space}  default: ${safeDefault(params[key].default)}`);
    if (typeof params[key].example !== 'undefined') code.push(`${space}  example: ${JSON.stringify(params[key].example)}`);

  });
  return code;
};
