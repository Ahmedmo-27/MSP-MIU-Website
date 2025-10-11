const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Leaderboard = sequelize.define('Leaderboard', {
  leaderboard_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  member_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'members',
      key: 'member_id'
    },
    validate: {
      notEmpty: true
    }
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  last_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'leaderboard',
  timestamps: false,
  updatedAt: 'last_updated'
});

module.exports = Leaderboard;
