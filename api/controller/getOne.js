const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = ({ schema, logging, destination, name }) => {
  const action = 'getOne';
  const { uppercase, sugarGenerated } = require('../utils');
  if (logging) console.log(`  API => REST => GET ONE ${name}`);
  const controllerSubFolder = `${destination}/controller/${name}`;
  const createFile = `${controllerSubFolder}/getOne.js`;

  let code = [];
  const top = [
    sugarGenerated(),
    `const ${uppercase(name)} = require("../../models/${uppercase(name)}");`,
    // `const { userCanApiKey } = require('../../configs/config');`,
    // `const userCan = require('../../user-can')(userCanApiKey);`,
  ];

  const swagger = [
    "/*",
    `* @oas [get] /${name}/{id}`,
    `* summary: "get one ${name}"`,
    `* tags: ["${name}"]`,
    `* parameters:`,
    `*   - name: 'id'`,
    `*     in: 'path'`,
    `*     description: id of the ${name}`,
    `*     schema:`,
    `*       type: 'string'`,
    `*       example: "123456"`,
    `* responses:`,
    `*   "200":`,
    `*     description: "get one ${name}"`,
    `*     schema:`,
    `*       type: "${uppercase(name)}"`,
    "*/",
  ];
  const func = [
    `module.exports = async (req, res) => {`,
    `  try {`,
    `    const { id } = req.params;`,
    `    const existing${uppercase(name)} = await ${uppercase(name)}.findOne({ _id: id });`,
    `    if (!existing${uppercase(name)}) throw new Error('${name} not found.');`,
  ];
  const end = [
    `    `,
    `  } catch (e) {`,
    `    console.error('GetOne => ${name}', e);`,
    `    return res.status(500).json({ error: e.message ? e.message : e });`,
    `  }`,
    `};`,
  ];
  const permissions = [
    // ``,
    // `// @TODO Permissions`,
    // `const permission = userCan('${action}', '${name}', { user: req.user, body: req.body, params: req.params, query: req.query });`,
    // `if (!permission) throw new Error('Permission denied for userCan ${action} ${name}');`,
    // ``
  ];
  const safeArea = [
    `// @TODO handle safe area. Should be idempotent.`,
    ``,
    `// maybe with @sugar-safe-start`,
    `// @sugar-safe-end`,
    ``
  ];
  const save = [
    `return res.json({ ${name}: existing${uppercase(name)} });`
  ];
  code = code.concat(top, swagger, func, permissions, safeArea, save, end);
  const pretty = beautify(code.join('\n'), { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(createFile, pretty);
};
