const bcrypt = require('bcrypt');
const UserSchema = require('../models/users');

const checkEmailAvailability = async (email) => !(await UserSchema.findOne({ email }));

const createUser = async (req, res) => {
  const isEmailAvailable = await checkEmailAvailability(req.body.email);

  if (isEmailAvailable) {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    try {
      const user = await UserSchema.create(newUser);

      req.session.user = { id: user._id };
      res.send({ message: 'User created' });
    } catch (err) {
      res.status(400).send({ error: 'Cannot create user' });
    }
  } else {
    res.status(409).send({ error: 'Account with this email already exists' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserSchema.findOne({ email }).select('password _id');
    const match = user && (await bcrypt.compare(password, user.password));

    if (match) {
      req.session.user = { id: user._id };
      res.send({ message: 'Login successful' });
    } else {
      res.status(401).send({ error: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(400).send({
      error: 'Request invalid',
    });
  }
};

const logoutUser = (req, res) =>
  req.session.destroy((err) => {
    err
      ? res.status(500).send({ error: 'Unable to logout' })
      : res.send({ message: 'Logout successful' });
  });

const checkSession = (req, res, next) =>
  req.session.user ? next() : res.status(401).send({ error: 'No user session' });

const getUser = async (req, res) => {
  const userId = req.session.user._id;

  try {
    const user = await UserSchema.findOne(userId).select('-_id');

    res.send({ message: 'User found', user });
  } catch (err) {
    res.status(500).send({ error: 'Cannot get user' });
  }
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  checkSession,
  getUser,
};
