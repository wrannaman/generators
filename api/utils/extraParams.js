module.exports = {
  sort: {
    type: "object",
    example: { field: 'asc', test: -1 },
  }, // query.sort({ field: 'asc', test: -1 })
  select: {
    type: "object",
    example: { first_name: 1, last_name: 1 },
  }, // query.select({ a: 1, b: 1 });
  populate: {
    type: "string",
    default: "",
    example: "anotherModel"
  },
  limit: {
    type: "number",
    default: 10,
    example: 25
  },
  page: {
    type: "number",
    default: 0,
    example: 1
  },
  search: {
    type: "string",
    default: "",
    example: "search string"
  },
};
