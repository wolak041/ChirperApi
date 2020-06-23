const MODE = process.env.NODE_ENV;
const config = MODE === 'development' ? require('./dev') : require('./prod');

module.exports = {
  ...config,
  MODE,
};
