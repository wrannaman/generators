const getType = (type) => {
  switch (type) {
    case 'Number':
      return 'Float';
    case 'Boolean':
      return 'Boolean';
    case 'ObjectId':
    case 'String':
    default:
      return 'String';
  }
};
const handleObject = ((schema, key) => {
  if (schema[key].type) return `${key}: ${getType(schema[key].type)}`;
  return `${key}: {
${Object.keys(schema[key]).map((value) => {
    return `${value}: ${getType(schema[key][value].type)}`;
  }).join(' ')}
  }`;
});
const getGQLSchema = (schema, returnAs = 'csv', round = 0) => {
  const str = [];
  Object.keys(schema).forEach((key) => {
    const toAdd = handleObject(schema, key)
    str.push(toAdd);
  });
  return returnAs === 'csv' ? str.join(', ') : str.join('\n\t\t\t');
}
module.exports = getGQLSchema;
