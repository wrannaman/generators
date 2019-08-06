const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = ({ schema, logging, destination, name }) => {
  const action = 'delete';
  const { uppercase, createUpdateCode, sugarGenerated } = require('../utils');
  if (logging) console.log(`  API => REST => DELETE ${name}`);
  const controllerSubFolder = `${destination}/controller/${name}`;
  const createFile = `${controllerSubFolder}/delete${uppercase(name)}.js`;

  let code = [];
  const top = [
    sugarGenerated(),
    `const ${uppercase(name)} = require("../../models/${uppercase(name)}");`,
    // `const { userCanApiKey } = require('../../configs/config');`,
    // `const userCan = require('../../user-can')(userCanApiKey);`,
  ];

  const swagger = [
    "/*",
    `* @oas [delete] /${name}/{id}`,
    `* summary: "delete a ${name}"`,
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
    `*     description: "delete a ${name}"`,
    `*     schema:`,
    `*       type: "${uppercase(name)}"`,
    "*/",
  ];
  const schemaKeys = Object.keys(schema.schema);
  // const validate = createUpdateCode(schema.schema, name);
  const validate = [];

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
    `    console.error('Delete => ${name}', e);`,
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
    `// save`,
    `const deleted = await existing${uppercase(name)}.delete();`,
    `return res.json({ ${name}: deleted });`
  ];
  code = code.concat(top, swagger, func, validate, permissions, safeArea, save, end);
  const pretty = beautify(code.join('\n'), { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(createFile, pretty);
};
