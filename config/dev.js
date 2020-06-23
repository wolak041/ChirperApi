module.exports = {
  MONGO: 'mongodb://localhost:27017/chirper',
  PORT: 3000,
  JWT_SECRET: 'test',
  ACCESS_JWT_EXPIRATION_TIME: 20 * 60,
  REFRESH_JWT_EXPIRATION_TIME: 30 * 24 * 60 * 60,
  MONGO_STORE_SECRET: 'test',
  HOSTNAME: '0.0.0.0',
  ALLOW_ORIGIN: ['http://192.168.0.199', 'http://localhost'],
};
