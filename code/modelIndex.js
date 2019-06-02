module.exports = (models = []) => {
  const code = ["module.exports = {"];
  models.forEach((model) => code.push(`${model}: require('../models/${model}'),`));
  code.push("};");
  return code.join('\n');
}
