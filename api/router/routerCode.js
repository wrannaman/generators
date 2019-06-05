const beautify = require('js-beautify').js;

module.exports = ({ name }) => {
  const { uppercase } = require('../utils');

  const code = `
  const express = require('express');
  const router = express.Router();
  const {
    create${uppercase(name)},
    delete${uppercase(name)},
    get${uppercase(name)},
    getOne${uppercase(name)},
    update${uppercase(name)}
  } = require('../controller/${name}');

  router.get('/${name}/:id', getOne${uppercase(name)});
  router.get('/${name}s', get${uppercase(name)});
  router.post('/${name}', create${uppercase(name)});
  router.put('/${name}/:id', update${uppercase(name)});
  router.delete('/${name}/:id', delete${uppercase(name)});

  module.exports = router;

  `;
  const pretty = beautify(code, { indent_size: 2, space_in_empty_paren: true });
  return pretty;
};
