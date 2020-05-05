const UserSchema = require('../models/users');

const getUsersList = (req, res) => {
  UserSchema.find({}, {}, (err, users) => {
    if (err || !users) {
      res.status(401).send({
        message: 'Unauthorized',
      });
    } else
      res.json({
        status: 'success',
        users,
      });
  });
};

module.exports = {
  getUsersList,
};
