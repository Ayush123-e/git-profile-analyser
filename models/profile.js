const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'avatar_url'
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  publicRepos: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'public_repos'
  },
  followers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  following: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  githubCreatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'github_created_at'
  },
  analysisData: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'analysis_data'
  }
}, {
  tableName: 'github_profiles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'analyzed_at',
  indexes: [
    {
      unique: true,
      fields: ['username']
    }
  ]
});

module.exports = Profile;
