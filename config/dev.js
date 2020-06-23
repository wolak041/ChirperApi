module.exports = {
  MONGO: 'mongodb://localhost:27017/chirper',
  MONGO_STORE_SECRET: 'test',
  JWT_SECRET: 'test',
  ACCESS_JWT_EXPIRATION_TIME: 20 * 60,
  REFRESH_JWT_EXPIRATION_TIME: 30 * 24 * 60 * 60,
  HOSTNAME: '0.0.0.0',
  PORT: 3000,
  ALLOW_ORIGIN: ['http://192.168.0.199', 'http://localhost'],
};
