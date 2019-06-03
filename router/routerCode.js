const beautify = require('js-beautify').js;

module.exports = ({ name }) => {
  const { uppercase } = require('../utils');

  const code = `
  const express = require('express');
  const router = express.Router();
  const { create, delete${uppercase(name)}, get, getOne, update } = require('../controller/${name}');

  router.get('/${name}/:id', getOne);
  router.get('/${name}', get);
  router.post('/${name}', create);
  router.put('/${name}', update);
  router.delete('/${name}', delete${uppercase(name)});

  module.exports = router;

  `;
  const pretty = beautify(code, { indent_size: 2, space_in_empty_paren: true });
  return pretty;
};
