const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = ({ schema, logging, destination, name }) => {
  const action = 'update';
  const { uppercase, createUpdateCode, sugarGenerated } = require('../utils');
  if (logging) console.log(`  API => REST => UPDATE ${name}`);
  const controllerSubFolder = `${destination}/controller/${name}`;
  const createFile = `${controllerSubFolder}/update.js`;

  let code = [];
  const top = [
    sugarGenerated(),
    `const ${uppercase(name)} = require("../../models/${uppercase(name)}");`,
    // `const { userCanApiKey } = require('../../configs/config');`,
    // `const userCan = require('../../user-can')(userCanApiKey);`,
  ];

  const swagger = [
    "/*",
    `* @oas [put] /${name}/{id}`,
    `* summary: "update a ${name}"`,
    `* tags: ["${name}"]`,
    `* parameters:`,
    `*   - name: 'id'`,
    `*     in: 'path'`,
    `*     description: id of the ${name}`,
    `*     schema:`,
    `*       type: 'string'`,
    `*       example: "123456"`,
    `* requestBody:`,
    `*   description: ${uppercase(name)} - **Update** `,
    `*   required: true`,
    `*   content:`,
    `*     application/json:`,
    `*       schema:`,
    `*        $ref: '#/components/schemas/${uppercase(name)}'`,
    `* responses:`,
    `*   "200":`,
    `*     description: "update a ${name}"`,
    `*     schema:`,
    `*       type: "${uppercase(name)}"`,
    "*/",
  ];
  const schemaKeys = Object.keys(schema.schema);
  const validate = createUpdateCode(schema.schema, name);
  const func = [
    `module.exports = async (req, res) => {`,
    `  try {`,
    `    const { ${schemaKeys.join(', ')}} = req.body;`,
    `    const { id } = req.params;`,
    `    const existing${uppercase(name)} = await ${uppercase(name)}.findOne({ _id: id });`,
    `    if (!existing${uppercase(name)}) throw new Error('${name} not found.');`,
  ];
  const end = [
    `    `,
    `  } catch (e) {`,
    `    console.error('Update => ${name}', e);`,
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
    `const updated = await existing${uppercase(name)}.save();`,
    `return res.json({ ${name}: updated });`
  ];
  code = code.concat(top, swagger, func, validate, permissions, safeArea, save, end);
  const pretty = beautify(code.join('\n'), { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(createFile, pretty);
};
