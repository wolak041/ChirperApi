const UserSchema = require('../models/users');
require('colors');

const isUserExist = async () => await UserSchema.find().countDocuments().exec();

const initializeUser = async () => {
  if (!(await isUserExist())) {
    const user = new UserSchema({
      name: 'test',
      email: 'test@test.com',
      password: 'test',
    });

    user.save((err) =>
      err
        ? console.log('\n🚨🚨🚨 Could not create user 🚨🚨🚨\n', err.toString().brightRed)
        : console.log('\n👩🧑👩 User initialized 🧑👩🧑\n'),
    );
  }
};

module.exports = initializeUser;
