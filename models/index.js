const sequelize = require('../config/database');
const Profile = require('./profile');

const db = {
  sequelize,
  Sequelize: sequelize.constructor,
  Profile
};

module.exports = db;
