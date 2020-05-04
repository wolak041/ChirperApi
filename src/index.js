require('colors');
const config = require('../config/common');

const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log(`[${(new Date()).toLocaleString()}]: ${req.method.cyan} ${req.originalUrl.yellow}`);
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({ test: 'Hello World' });
});

app.listen(config.port, async () => {
  try {
    // console.log('\n📚📚📚 Connected 📚📚📚\n');

  } catch (error) {
    // console.error(`\n🚨🚨🚨 Error 🚨🚨🚨\n${error.toString().brightRed}`);
  }
});
