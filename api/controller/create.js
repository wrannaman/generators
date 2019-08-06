const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = ({ schema, logging, destination, name }) => {
  const action = 'create';
  const { uppercase, createValidationCode, sugarGenerated } = require('../utils');
  if (logging) console.log(`  API => REST => CREATE ${name}`);
  const controllerSubFolder = `${destination}/controller/${name}`;
  const createFile = `${controllerSubFolder}/create.js`;

  let code = [];
  const top = [
    sugarGenerated(),
    `const ${uppercase(name)} = require("../../models/${uppercase(name)}");`,
    // `const { userCanApiKey } = require('../../configs/config');`,
    // `const userCan = require('../../user-can')(userCanApiKey);`,
  ];

  const swagger = [
    "/*",
    `* @oas [post] /${name}`,
    `* summary: "create a ${name}"`,
    `* tags: ["${name}"]`,
    `* requestBody:`,
    `*   description: ${uppercase(name)} - **Create** `,
    `*   required: true`,
    `*   content:`,
    `*     application/json:`,
    `*       schema:`,
    `*        $ref: '#/components/schemas/${uppercase(name)}'`,
    `* responses:`,
    `*   "200":`,
    `*     description: "create a ${name}"`,
    `*     schema:`,
    `*       type: "${uppercase(name)}"`,
    "*/",
  ];
  const schemaKeys = Object.keys(schema.schema);
  const validate = createValidationCode(schema.schema, name);
  const func = [
    `module.exports = async (req, res) => {`,
    `  try {`,
    `    const { ${schemaKeys.join(', ')}} = req.body;`,
    `    const new${uppercase(name)} = {};`,
  ];
  const end = [
    `    `,
    `  } catch (e) {`,
    `    console.error('Create => ${name}', e);`,
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
    `const created = await ${uppercase(name)}.create(new${uppercase(name)});`,
    `return res.json({ ${name}: created });`
  ];
  code = code.concat(top, swagger, func, validate, permissions, safeArea, save, end);
  const pretty = beautify(code.join('\n'), { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(createFile, pretty);
};
