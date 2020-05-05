const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserSchema = require('../models/users');
const config = require('../../config/common');

const checkEmailAvailability = (email) => UserSchema.findOne({ email }).then((result) => !result);

const generateTokens = (req, user) => {
  const accessToken = jwt.sign(
    {
      sub: user._id,
      type: 'ACCESS_TOKEN',
    },
    config.TOKEN_SECRET_JWT,
    {
      expiresIn: 120,
    },
  );

  const refreshToken = jwt.sign(
    {
      sub: user._id,
      type: 'REFRESH_TOKEN',
    },
    config.TOKEN_SECRET_JWT,
    {
      expiresIn: 480,
    },
  );

  return {
    accessToken,
    refreshToken,
  };
};

const createUser = (req, res) => {
  checkEmailAvailability(req.body.email).then((valid) => {
    if (valid) {
      UserSchema.create(
        {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        },
        (err, user) => {
          if (err || !user)
            res.status(500).send({
              message: 'Cannot create user',
            });
          else res.json(generateTokens(req, user));
        },
      );
    } else
      res.status(409).send({
        message: 'Error, cannot complete',
      });
  });
};

const loginUser = (req, res) => {
  UserSchema.findOne(
    {
      email: req.body.email,
    },
    (err, user) => {
      if (err || !user)
        res.status(401).send({
          message: 'Unauthorized',
        });
      else {
        if (bcrypt.compareSync(req.body.password, user.password))
          res.json(generateTokens(req, user));
        else
          res.status(401).send({
            message: 'Invalid email/password',
          });
      }
    },
  ).select('password');
};

const verifyAccessToken = (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(401).send({
      error: 'Token missing',
    });

  const bearer = 'Bearer';
  const authorizationToken = req.headers.authorization.split(' ');

  if (authorizationToken[0] !== bearer)
    return res.status(401).send({
      error: 'Token not complete',
    });

  jwt.verify(authorizationToken[1], config.TOKEN_SECRET_JWT, (err) => {
    if (err)
      return res.status(401).send({
        error: 'Token invalid',
      });

    next();
  });
};

const verifyRefreshToken = (req, res) => {
  if (!req.body.refreshToken)
    res.status(401).send({
      message: 'Refresh token missing',
    });

  const bearer = 'Bearer';
  const refreshToken = req.body.refreshToken.split(' ');

  if (refreshToken[0] !== bearer)
    return res.status(401).send({
      error: 'Refresh token not complete',
    });

  jwt.verify(refreshToken[1], config.TOKEN_SECRET_JWT, (err, payload) => {
    if (err)
      return res.status(401).send({
        error: 'Refresh token invalid',
      });

    UserSchema.findById(payload.sub, (err, user) => {
      if (!user)
        return res.status(401).send({
          error: 'User not found',
        });

      return res.json(generateTokens(req, user));
    });
  });
};

module.exports = {
  createUser,
  loginUser,
  verifyAccessToken,
  verifyRefreshToken,
};
