require('colors');
const config = require('../../config/common');

const startLog = () => {
  console.log(`\n🚀🚀🚀 Application running in ${config.MODE.brightGreen.underline} mode 🚀🚀🚀`);
  console.log(`📄📄📄 Server hostname: ${config.HOSTNAME.brightGreen.underline} 📄📄📄`);
  console.log(`🎧🎧🎧 Listening on port: ${config.PORT.toString().brightGreen.underline} 🎧🎧🎧\n`);
};

const trafficLog = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}]: ${req.method.cyan} ${req.originalUrl.yellow}`);
  next();
};

const mongoConnectionErrorLog = err =>
  console.log('\n🚨🚨🚨 Could not connect to MongoDB 🚨🚨🚨\n', err.toString().brightRed);

const mongoErrorLog = err =>
  console.log('\n🚨🚨🚨 MongoDB error 🚨🚨🚨\n', err.toString().brightRed);

module.exports = {
  startLog,
  trafficLog,
  mongoConnectionErrorLog,
  mongoErrorLog,
};
