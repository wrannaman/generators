const link = require('./Link');
const pro = require('./ProTip');
const theme = require('./theme');
const apiCall = require('./apiCall');

module.exports = (dest) => {
  theme(dest);
  pro(dest);
  link(dest);
  apiCall(dest);
};
