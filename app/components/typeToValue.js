module.exports = (type) => {
  let val = "";
  switch (type) {
    case 'ObjectId':
    case 'String':
      break;
    case 'Boolean':
      val = false;
      break;
    case 'Number':
      val = 0;
      break;
    default:
  }
  return val;
};
