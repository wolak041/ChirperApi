require('colors');
const mode = process.env.NODE_ENV;
const config = require(`./${mode === 'dev' ? 'dev' : 'prod'}`);

console.log(`\n🚀🚀🚀 Application running in ${mode.brightGreen.underline} mode 🚀🚀🚀`);
console.log(`🎧🎧🎧 Listening on port: ${config.PORT.toString().brightGreen.underline} 🎧🎧🎧\n`);

module.exports = {
  ...config,
  mode
};
