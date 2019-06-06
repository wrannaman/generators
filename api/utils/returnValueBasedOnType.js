module.exports = (type, key) => {
  if (!type) return key;
  switch (type.toLowerCase()) {
    case 'number':
      return `isNaN(${key}) ? ${key} : Number(${key})`;
    case 'boolean':
      return `${key} === 'false' ? false : true`;
    case 'objectid':
    default:
      return key;
  }
};
