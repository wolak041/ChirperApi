const mongose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const Schema = mongose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
}, {
  versionKey: false
});

UserSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

module.exports = mongose.model('User', UserSchema);
