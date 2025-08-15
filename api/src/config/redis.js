const Redis = require('ioredis');
const constants = require('./constants');

const redis = new Redis({
  host: constants.REDIS_HOST,
  port: constants.REDIS_PORT,
  enableOfflineQueue: false,
});

module.exports = redis;
