const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = ({ schema, logging, destination, name }) => {
  const action = 'get';
  const { getSearchCode, uppercase, getValidationCode, sugarGenerated, extraParams, getSchemaQueryDefinitions } = require('../utils');
  if (logging) console.log(`  API => REST => GET ${name}`);
  const controllerSubFolder = `${destination}/controller/${name}`;
  const createFile = `${controllerSubFolder}/get.js`;

  let code = [];
  const top = [
    sugarGenerated(),
    `const ${uppercase(name)} = require("../../models/${uppercase(name)}");`,
    // `const { userCanApiKey } = require('../../configs/config');`,
    // `const userCan = require('../../user-can')(userCanApiKey);`,
  ];
  let swagger = [
    "/*",
    `* @oas [get] /${name}s`,
    `* summary: "get ${name}s"`,
    `* tags: ["${name}"]`,
    `* parameters: `,
    `*   - in: query`,
    `*     name: page`,
    `*     description: page`,
    `*     schema:`,
    `*       type: integer`,
    `*   - in: query`,
    `*     name: limit`,
    `*     description: The numbers of items to return`,
    `*     schema:`,
    `*       type: integer`,
    `*   - in: query`,
    `*     name: filters`,
    `*     description: Filters to search on specific 'columns'`,
    `*     style: deepObject`,
    `*     schema:`,
    `*       type: object`,
    `*       example: 'stringified array [{"column":{"title":"Name","field":"name","type":"…Sort":"asc","id":0}},"operator":"=","value":"1"}]'`,
    `*   - in: query`,
    `*     name: orderBy`,
    `*     style: deepObject`,
    `*     description: object containing how to sort the items`,
    `*     schema:`,
    `*       type: object`,
    `*       example: { "field": "asc", "test": -1, "field2": "desc" }`,
    `*   - in: query`,
    `*     name: select`,
    `*     description: object containing fields want to be returned`,
    `*     style: deepObject`,
    `*     schema:`,
    `*       type: object`,
    `*       example: { "first_name": 1 }`,
  ];

  swagger = swagger.concat(getSchemaQueryDefinitions(schema.schema));
  swagger = swagger.concat([
    // `* requestBody:`,
    // `*   description: ${uppercase(name)} - **GET** `,
    // `*   required: true`,
    // `*   content:`,
    // `*     application/json:`,
    // `*       schema:`,
    // `*        $ref: '#/components/schemas/Extended${uppercase(name)}'`,
    `* responses:`,
    `*   "200":`,
    `*     description: "get ${name}s"`,
    `*     schema:`,
    `*       type: "${uppercase(name)}"`,
    "*/",
  ]);
  const schemaKeys = Object.keys(schema.schema);
  const paginateValidation = getValidationCode(schema.schema, name);
  const extraKeys = Object.keys(extraParams);


  const func = [
    `module.exports = async (req, res) => {`,
    `  try {`,
    `    let { ${extraKeys.join(', ')}} = req.query;`,
    `    const { ${schemaKeys.join(', ')}} = req.query;`,
    //`    console.log('req query ', req.query);`,
    `    // The model query`,
    `    const find = {};`,
    `    let parsedFilters = null;`,
    `    // pagination object (search, sort, filter, etc);
        const where = {};
        if (filters && filters !== '[]') {
         parsedFilters = JSON.parse(filters);

          parsedFilters.forEach((f) => {
            let regexValue = {};
            if (f.column.type === 'boolean') {
              regexValue = f.value === 'checked' ? true : false;
            } else if (Array.isArray(f.value) && f.value.length > 0) {
              if (f.column.type === 'string') {
                regexValue = { $in: [] };
                f.value.forEach((val) => {
                  regexValue.$in.push(val)
                });
              } else {
                regexValue = { $or: [] };
                f.value.forEach((val) => {
                  regexValue.$or.push({ $eq: val });
                });
              }
            } else if (f.column.type === 'numeric' || f.column.type === 'number') {
              regexValue = { $eq: f.value };
            } else {
              regexValue = { $regex: new RegExp(f.value, "ig")};
            }
            if (JSON.stringify(regexValue) !== '{}') find[f.column.field] = regexValue;
          });
    `,
    `    }`,
    `

              // search
              if (search) {
                ${getSearchCode(schema)};
              }
    `,
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
    // `console.log('find ', find);`,
    // `console.log('where', where);`,
    `const ${name} = await ${uppercase(name)}.paginate(find, where); // @TODO populate: '<model name>'`,
    `return res.json({ ${name}s: ${name} });`
  ];
  code = code.concat(top, swagger, func, paginateValidation, permissions, safeArea, save, end);
  const pretty = beautify(code.join('\n'), { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(createFile, pretty);
};
