const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = ({ schema, logging, destination, name }) => {
  const action = 'get';
  const { uppercase, getValidationCode, sugarGenerated, extraParams } = require('../utils');
  if (logging) console.log(`API => CRUD => GET ${name}`);
  schema = require(schema); // eslint-disable-line
  const controllerSubFolder = `${destination}/controller/${name}`;
  const createFile = `${controllerSubFolder}/get.js`;

  let code = [];
  const top = [
    sugarGenerated(),
    `const ${uppercase(name)} = require("../../models/${name}.js");`,
    `const { userCanApiKey } = require('../../configs/config');`,
    `const userCan = require('user-can')(userCanApiKey);`,
  ];
  const swagger = [
    "/*",
    `* @oas [get] /${name}`,
    `* summary: "get ${name}s"`,
    `* tags: ["${name}"]`,
    `* requestBody:`,
    `*   description: ${uppercase(name)} - **GET** `,
    `*   required: true`,
    `*   content:`,
    `*     application/json:`,
    `*       schema:`,
    `*        $ref: '#/components/schemas/Extended${uppercase(name)}'`,
    `* responses:`,
    `*   "200":`,
    `*     description: "get ${name}s"`,
    `*     schema:`,
    `*       type: "${uppercase(name)}"`,
    "*/",
  ];
  const schemaKeys = Object.keys(schema.schema);
  const paginateValidation = getValidationCode(schema.schema, name);
  const extraKeys = Object.keys(extraParams);


  const func = [
    `module.exports = async (req, res) => {`,
    `  try {`,
    `    let { ${extraKeys.join(', ')}} = req.query;`,
    `    const { ${schemaKeys.join(', ')}} = req.query;`,
    `    // The model query`,
    `    const find = {};`,
    `    // pagination object (search, sort, filter, etc)`,
    `    const where = {};`,
  ];
  const end = [
    `    `,
    `  } catch (e) {`,
    `    console.error('GET => ${name}', e);`,
    `    return res.status(500).json({ error: e.message ? e.message : e });`,
    `  }`,
    `};`,
  ];
  const permissions = [
    ``,
    `// @TODO Permissions`,
    `const permission = userCan('${action}', '${name}', req.user, req.body, req.query, req.params);`,
    `if (!permission) throw new Error('Permission denied for userCan ${action} ${name}');`,
    ``
  ];
  const safeArea = [
    `// @TODO handle safe area. Should be idempotent.`,
    ``,
    `// maybe with @sugar-safe-start`,
    `// @sugar-safe-end`,
    ``
  ];
  const save = [
    `// save`,
    `const users = await User.paginate(find, where); // @TODO populate: 'team'`,
    `return res.json({ users });`
  ];
  code = code.concat(top, swagger, func, paginateValidation, permissions, safeArea, save, end);
  const pretty = beautify(code.join('\n'), { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(createFile, pretty);
};
