module.exports = {
  "port": 7777,
  "db": {
    "mongoURL": "mongodb://localhost:27017/sugar",
    "mongoOptions":  { "useNewUrlParser": true }
  },
  "redisConfig": {
    "host": "localhost",
    "port": 6379,
    "password": ""
  },
  "jwt_secret": "e4b717984dab52c8168f5b61bbb8bea42acfe921",
  "basicAuth": {
    "username": "sugar",
    "password": "kubes"
  },
  "env": "local"
}
