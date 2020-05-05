require('colors');
const express = require('express');
const config = require('../config/common');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const initializeData = require('./seed/user');
const path = require('path');
const favicon = require('serve-favicon');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}]: ${req.method.cyan} ${req.originalUrl.yellow}`);
  next();
});
app.use(express.static('public'));
app.use('/', routes);

app.get('/hello', (req, res) => {
  res.status(200).json({ test: 'Hello World' });
});

mongoose
  .connect(config.MONGO, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .catch((err) =>
    console.log('\n🚨🚨🚨 Could not connect to MongoDB 🚨🚨🚨\n', err.toString().brightRed)
  );

mongoose.connection.on('connected', () => {
  initializeData();

});
mongoose.connection.on('error', err =>
  console.log('\n🚨🚨🚨 Could not connect to MongoDB 🚨🚨🚨\n', err.toString().brightRed)
);

app.listen(config.PORT);
