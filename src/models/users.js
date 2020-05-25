const mongose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const UserSchema = new mongose.Schema(
  {
    forename: {
      type: String,
      trim: true,
      required: true,
    },
    surname: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

UserSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

module.exports = mongose.model('User', UserSchema);
