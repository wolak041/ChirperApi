const passport = require('passport');
const jwt = require('jsonwebtoken');
const {
  JWT_SECRET,
  ACCESS_JWT_EXPIRATION_TIME,
  REFRESH_JWT_EXPIRATION_TIME,
  MODE,
} = require('../../config');

const localCheck = (req, res, next) =>
  passport.authenticate('local', {
    session: false,
    failWithError: true,
  })(req, res, next);

const accessTokenCheck = (req, res, next) =>
  passport.authenticate('accessToken', {
    session: false,
    failWithError: true,
  })(req, res, next);

const refreshTokenCheck = (req, res, next) =>
  passport.authenticate('refreshToken', {
    session: false,
    failWithError: true,
  })(req, res, next);

const createNewTokens = (req, res, next) => {
  const { _id } = req.user;

  const accessToken = jwt.sign({ _id }, JWT_SECRET, {
    expiresIn: ACCESS_JWT_EXPIRATION_TIME,
  });

  const refreshToken = jwt.sign({ _id }, JWT_SECRET, {
    expiresIn: REFRESH_JWT_EXPIRATION_TIME,
  });

  req.accessToken = accessToken;
  req.refreshToken = refreshToken;
  next();
};

const refreshTokens = (req, res) => {
  const { _id } = req.user;
  const { refreshToken } = req.cookies;

  const refreshTokenExpirationTime = jwt.decode(refreshToken, { complete: true }).payload.exp;
  const timeDiff = refreshTokenExpirationTime - REFRESH_JWT_EXPIRATION_TIME * 0.5;

  if (timeDiff * 1000 < Date.now()) {
    const refreshToken = jwt.sign({ _id }, JWT_SECRET, {
      expiresIn: REFRESH_JWT_EXPIRATION_TIME,
    });

    res.cookie('refreshToken', refreshToken, {
      maxAge: REFRESH_JWT_EXPIRATION_TIME * 1000,
      httpOnly: true,
      secure: MODE === 'production',
      sameSite: 'None',
    });
  }

  const accessToken = jwt.sign({ _id }, JWT_SECRET, {
    expiresIn: ACCESS_JWT_EXPIRATION_TIME,
  });

  res.send({
    message: 'Token refreshed',
    accessToken,
    accessTokenExpirationTime: ACCESS_JWT_EXPIRATION_TIME,
  });
};

module.exports = {
  localCheck,
  accessTokenCheck,
  createNewTokens,
  refreshTokenCheck,
  refreshTokens,
};
