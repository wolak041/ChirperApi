const MODE = process.env.NODE_ENV;
const config = MODE === 'dev' ? require('./dev') : require('./prod');

module.exports = {
  ...config,
  MODE,
};
