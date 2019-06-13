module.exports = ({ schema, name }) => {
  const safeType = require('./safeType');
  const makeProperties = require('./makeProperties');
  const safeDefault = require('./safeDefault');
  const { uppercase, extraParams } = require('../utils');
  let code = [
    `      ${uppercase(name)}:`,
    `        properties:`,
  ];
  const required = [];
  Object.keys(schema.schema).forEach(key => {
    const value = schema.schema[key];
    if (value.type) {
      code.push(`          ${key}:`);
      code.push(`            type: ${safeType(value.type.toLowerCase())}`);
      if (typeof value.default !== 'undefined') code.push(`            default: ${safeDefault(value.default)}`);
      if (typeof value.unique !== 'undefined') code.push(`            unique: ${value.unique}`);

      if (value.required) required.push(key);
    } else if (Array.isArray(value)) {
      code.push(`          ${key}:`);
      code.push(`            type: array`);
      code.push(`            items:`);
      value.forEach((val) => {
        if (val.type) {
          code.push(`              type: ${safeType(val.type.toLowerCase())}`);
        } else {
          Object.keys(val).forEach(_key => {
            const _value = val[_key];
            code.push(`                ${_key}:`);
            code.push(`                  type: ${safeType(_value.type.toLowerCase())}`);
            if (typeof _value.default !== 'undefined') code.push(`            default: ${safeDefault(_value.default)}`);
          });
        }
      });
    } else {
      code.push(`          ${key}:`);
      code.push(`            type: object`);
      code.push(`            properties:`);
      Object.keys(value).forEach(_key => {
        const _value = value[_key];
        code.push(`              ${_key}:`);
        code.push(`                type: ${safeType(_value.type.toLowerCase())}`);
        if (typeof _value.default !== 'undefined') code.push(`            default: ${safeDefault(_value.default)}`);
      });
    }
  });
  if (required.length > 0) code.push('        required:');
  required.forEach(item => code.push(`        - ${item}`));

  // Extended one to include get parameters
  // ExtendedErrorModel:
  //   allOf:     # Combines the BasicErrorModel and the inline model
  //     - $ref: '#/components/schemas/BasicErrorModel'
  //     - type: object
  //       required:
  //         - rootCause
  //       properties:
  //         rootCause:
  //           type: string
  code.push(`      Extended${uppercase(name)}:`);
  code.push(`        allOf:`);
  code.push(`          - $ref: '#/components/schemas/${uppercase(name)}'`);
  code.push(`          - type: object`);
  code.push(`            properties:`);
  code = code.concat(makeProperties(extraParams, '              '));
  return code.join('\n');
};
