const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = ({ schema, logging, destination, name }) => {
  const { uppercase, validationCode, sugarGenerated } = require('../utils');
  if (logging) console.log(`API=>CRUD=>CREATE ${name}`);
  schema = require(schema); // eslint-disable-line
  const controllerSubFolder = `${destination}/controller/${name}`;
  const createFile = `${controllerSubFolder}/create.js`;

  let code = [];
  const top = [
    sugarGenerated(),
    `const ${uppercase(name)} = require("../../models/${name}.js");`
  ]

  const swagger = [
    "/*",
    `* @oas [post] /${name}`,
    `* summary: "create a ${name}"`,
    `* tags: ["${name}"]`,
    `* requestBody:`,
    `*   description: Optional description in *Markdown*`,
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
  const validate = validationCode(schema.schema, name);
  const func = [
    `module.exports = (req, res) => {`,
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
    ``,
    `// @TODO Permissions`,
    ``
  ];
  const save = [
    `// save`,
    `const created = await ${uppercase(name)}.create(new${uppercase(name)});`,
    `return res.json({ ${name}: created });`
  ];
  code = code.concat(top, swagger, func, validate, permissions, save, end);
  code = code.concat([

  ]);

  if (logging) console.log(`creating controller/${name}/create.js`);
  const pretty = beautify(code.join('\n'), { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(createFile, pretty);
};
