const MODE = process.env.NODE_ENV;
const config = require(`./${MODE === 'dev' ? 'dev' : 'prod'}`);

module.exports = {
  ...config,
  MODE
};
