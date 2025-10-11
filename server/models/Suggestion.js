const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Suggestion = sequelize.define('Suggestion', {
  suggestion_id: {
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
  suggestion: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  anonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'suggestions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Suggestion;
