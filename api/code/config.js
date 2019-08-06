module.exports = {
  port: 7777,
  db: {
    mongoURL: "mongodb://localhost:27017/sugar",
    mongoOptions: { useNewUrlParser: true }
  },
  redisConfig: {
    host: "localhost",
    port: 6379,
    password: ""
  },
  jwt_secret: "sugar-secret",
  basicAuth: {
    username: "sugar",
    password: "kubes"
  },
  env: "local"
};
