require('colors');
const UserSchema = require('../models/users');

const countUsers = async () => await UserSchema.find().countDocuments().exec();

const initializeUser = async () => {
  const usersNumber = await countUsers();

  if (!usersNumber) {
    const user = new UserSchema({
      nickname: 'test',
      email: 'test@test.com',
      password: '123456',
    });

    return user.save((err) =>
      err
        ? console.log('\n🚨🚨🚨 Could not create user 🚨🚨🚨\n', err.toString().brightRed)
        : console.log('\n👩🧑👩 User initialized 🧑👩🧑\n'),
    );
  }
};

module.exports = initializeUser;
