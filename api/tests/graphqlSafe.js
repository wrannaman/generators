module.exports = (prop) => {
  console.log('PROP', typeof prop)
  switch (typeof prop) {
    case "string":
      return `"${prop}"`;
    default:
      return `${prop}`;
  }
};
