module.exports = (type) => {
  switch (type.toLowerCase()) {
    case 'string':
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    case 'number':
      return Math.floor(Math.random() * 1000);
    case 'object':
      return { hi: true, cool: "okay", bean: 123 };
    case 'boolean':
      return Math.floor(Math.random() * 1000) > 500 ? true : false;
    default:

  }
};
