require('colors');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');

const config = require('../config/common');
const logs = require('./middleware/logs');
const routes = require('./routes');
const initializeUser = require('./seed/user');
const initializePost = require('./seed/feed');

const app = express();

mongoose
  .connect(config.MONGO, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch(logs.mongoConnectionErrorLog);

mongoose.connection.on('connected', () => {
  if (config.MODE === 'dev') {
    initializeUser();
    initializePost();
  }
});
mongoose.connection.on('error', logs.mongoErrorLog);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: config.SESSION_SECRET,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      touchAfter: config.SESSION_UPDATE_AFTER,
      secret: config.MONGO_STORE_SECRET,
    }),
  }),
);

if (config.MODE === 'dev') {
  app.use(logs.trafficLog);
}

app.use('/api', routes);
app.use(
  '/',
  express.static('public'),
  favicon(path.join(__dirname, '..', 'public', 'favicon.ico')),
);

app.listen(config.PORT, config.HOSTNAME, logs.startLog);
