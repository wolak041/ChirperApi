require('colors');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { MONGO, MODE, ALLOW_ORIGIN, PORT, HOSTNAME } = require('../config');
const { passportConfig } = require('./passport');
const logs = require('./middlewares/logs');
const apiRoutes = require('./apiRoutes');
const initializeUser = require('./seed/user');
const initializePost = require('./seed/feed');
const { catchErrors } = require('./middlewares/errors');
const isDev = MODE === 'development';

const app = express();

passportConfig();

mongoose
  .connect(MONGO, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch(logs.mongoConnectionErrorLog);

mongoose.connection.on('connected', () => {
  if (isDev) {
    initializeUser();
    initializePost();
  }
});
mongoose.connection.on('error', logs.mongoErrorLog);

app.use(
  cors({
    credentials: true,
    origin: ALLOW_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    exposedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With'],
  }),
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

if (isDev) {
  app.use(logs.trafficLog);
}

app.use('/api', apiRoutes);
app.use(catchErrors);

app.listen(PORT, HOSTNAME, logs.startLog);
