module.exports = `
const _redis = require("redis");
const { promisify } = require("util");
const { redisConfig } = require("../config");
const { host, port, password } = redisConfig;
const redis = _redis.createClient({ host, port, password });
const getAsync = promisify(redis.get).bind(redis);
redis.on('connect', () => {
  console.error("Redis      OKAY");
});
redis.on("error", (err) => {
  console.error("Redis Connection Error", err);
});
module.exports.redis = redis;
module.exports.redisGetAsync = getAsync;

`
