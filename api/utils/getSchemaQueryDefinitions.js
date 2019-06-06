module.exports = (schema) => {
  const { safeType } = require('../swagger');
  const code = [];
  Object.keys(schema).forEach(key => {
    code.push(`*   - in: query`);
    code.push(`*     name: ${key}`);
    // code.push(`*     style: deepObject`);
    code.push(`*     description: object supports mongodb queries on objects. see https://mongoosejs.com/docs/api.html#query_Query or ${safeType(schema[key].type).toLowerCase()} ${key} `);
    code.push(`*     schema:`);
    code.push(`*       oneOf:`);
    code.push(`*         - type: ${safeType(schema[key].type).toLowerCase()}`);
    code.push(`*         - type: object`);
    // code.push(`*       type: ${safeType(schema[key].type).toLowerCase()}`);
    code.push(`*       example: { $gte: 5 } `);

  });
  return code;
};
