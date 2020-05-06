require('colors');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const config = require('../config/common');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const initializeUser = require('./seed/user');
const initializePost = require('./seed/feed');
const path = require('path');
const favicon = require('serve-favicon');

const app = express();

mongoose
  .connect(config.MONGO, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) =>
    console.log('\n🚨🚨🚨 Could not connect to MongoDB 🚨🚨🚨\n', err.toString().brightRed),
  );

mongoose.connection.on('connected', () => {
  initializeUser();
  initializePost();
});
mongoose.connection.on('error', (err) =>
  console.log('\n🚨🚨🚨 MongoDB error 🚨🚨🚨\n', err.toString().brightRed),
);

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
      touchAfter: 24 * 60 * 60,
      secret: config.MONGO_STORE_SECRET,
    }),
  }),
);
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}]: ${req.method.cyan} ${req.originalUrl.yellow}`);
  next();
});
app.use(
  '/public',
  express.static('public'),
  favicon(path.join(__dirname, '..', 'public', 'favicon.ico'))
);
app.use('/api', routes);

app.listen(config.PORT);
