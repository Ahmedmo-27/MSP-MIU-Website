const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Sponsor = sequelize.define('Sponsor', {
  sponsor_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  logo_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  website_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'sponsors',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Sponsor;
