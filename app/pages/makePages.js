const _app = require('./_app');
const _document = require('./_document');
const about = require('./about');
const idx = require('./index');


module.exports = ({ destination, schema }) => {
  about(destination);
  _document(destination);
  _app(destination);
  idx({ destination, schema });
};
