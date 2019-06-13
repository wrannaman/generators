
module.exports = (obj) => {
  const genData = require('./genData');
  if (!obj) throw new Error('subdocument is undefined');
  let fake = {};
  if (Array.isArray(obj)) {
    fake = [];
    obj.forEach((o) => {
      if (o.type) {
        fake.push(genData(o.type));
      } else {
        Object.keys(o).forEach(key => {
          fake.push({ [key]: genData(o[key].type) });
        });
      }
    });
  } else {
    Object.keys(obj).forEach(key => {
      fake[key] = genData(obj[key].type);
    });
  }
  return fake;
};
