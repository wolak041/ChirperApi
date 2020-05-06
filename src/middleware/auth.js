const bcrypt = require('bcrypt');
const UserSchema = require('../models/users');

const checkEmailAvailability = (email) => UserSchema.findOne({ email }).then((result) => !result);

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
              error: 'Cannot create user',
            });
          else {
            req.session.user = { id: user._id };
            res.json({ message: 'User created' });
          }
        },
      );
    } else
      res.status(409).send({
        error: 'Error, cannot complete',
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
          error: 'Unauthorized',
        });
      else {
        bcrypt.compare(req.body.password, user.password, (error, result) => {
          if (result) {
            req.session.user = { id: user._id };
            res.send({ message: 'Login successful' });
          } else res.status(401).send({ error: 'Invalid email or password' });
        });
      }
    },
  ).select('password _id');
};

const logoutUser = (req, res) =>
  req.session.destroy((err) => {
    err
      ? res.status(500).send({ error: 'Unable to logout' })
      : res.json({ message: 'Logout successful ' });
  });

const checkIfSessionExists = (req, res, next) =>
  req.session.user ? next() : res.status(401).send({ error: 'No user session' });

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  checkIfSessionExists,
};
