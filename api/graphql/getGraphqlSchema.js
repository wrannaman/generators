module.exports = (schema, returnAs = 'csv') => {
  const str = [];
  Object.keys(schema).forEach(key => {
    let type = "String";
    switch (schema[key].type) {
      case 'Number':
        type = 'Float';
        break;
      case 'Boolean':
        type = 'Boolean';
        break;
      case 'ObjectId':
      case 'String':
      default:
    }
    str.push(`${key}: ${type}`);
  });
  return returnAs === 'csv' ? str.join(', ') : str.join('\n\t\t\t');
}
