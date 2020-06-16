const config = require('../../config/common');
const bcrypt = require('bcrypt');

const hashPassword = async password => await bcrypt.hash(password, config.SALT_ROUNDS);

module.exports = hashPassword;
