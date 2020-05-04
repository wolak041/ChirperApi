require('colors');
const config = require('../config/common');

const express = require('express');
const app = express();
const favicon = require('serve-favicon');
const path = require('path');

app.use((req, res, next) => {
  console.log(`[${(new Date()).toLocaleString()}]: ${req.method.cyan} ${req.originalUrl.yellow}`);
  next();
});

app.use(favicon(path.join(__dirname,'..','public','favicon.ico')));
app.use(express.static('public'));

app.get('/get', (req, res) => {
  res.status(200).json({ test: 'Hello World' });
});

app.listen(config.port);
