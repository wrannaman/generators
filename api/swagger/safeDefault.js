module.exports = (defaultString) => {
  if (defaultString === "") return '""';
  if (JSON.stringify(defaultString) === "{}") return `{}`;
  return defaultString;
};
