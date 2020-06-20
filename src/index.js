require('colors');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const expressStaticGzip = require('express-static-gzip');

const config = require('../config/common');
const logs = require('./middleware/logs');
const apiRoutes = require('./apiRoutes');
const initializeUser = require('./seed/user');
const initializePost = require('./seed/feed');

const app = express();

mongoose
  .connect(config.MONGO, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch(logs.mongoConnectionErrorLog);

mongoose.connection.on('connected', () => {
  if (config.MODE === 'dev') {
    initializeUser();
    initializePost();
  }
});
mongoose.connection.on('error', logs.mongoErrorLog);

app.use(
  cors({
    credentials: true,
    origin: config.ALLOW_ORIGIN,
    methods: ['POST'],
  }),
);
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

app.use('/api', apiRoutes);

if (config.MODE === 'dev') {
  app.use(expressStaticGzip(path.join(__dirname, '..', 'public')));
  app.get('/*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));
}

app.listen(config.PORT, config.HOSTNAME, logs.startLog);
