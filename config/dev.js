module.exports = {
  MONGO: 'mongodb://localhost:27017/chirper',
  PORT: 3000,
  SESSION_SECRET: 'test',
  JWT_SECRET: 'test',
  JWT_EXPIRATION_TIME: 1200,
  MONGO_STORE_SECRET: 'test',
  SESSION_UPDATE_AFTER: 24 * 60 * 60,
  HOSTNAME: 'localhost',
  SALT_ROUNDS: 10,
  ALLOW_ORIGIN: ['http://192.168.0.199:8080', 'http://localhost:3000', 'http://localhost:8080'],
};
