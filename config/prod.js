module.exports = {
  MONGO: process.env.MONGO,
  MONGO_STORE_SECRET: process.env.MONGO_STORE_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  ACCESS_JWT_EXPIRATION_TIME: parseInt(process.env.ACCESS_JWT_EXPIRATION_TIME, 10),
  REFRESH_JWT_EXPIRATION_TIME: parseInt(process.env.REFRESH_JWT_EXPIRATION_TIME),
  HOSTNAME: process.env.HOSTNAME,
  PORT: process.env.PORT,
  ALLOW_ORIGIN: process.env.ALLOW_ORIGIN
};
