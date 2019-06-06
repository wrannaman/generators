module.exports = (prop) => {
  switch (typeof prop) {
    case "string":
      return `"${prop}"`;
    default:
      return `${prop}`;
  }
};
