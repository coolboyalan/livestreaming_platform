const sequelize = require("../db");
const { Sequelize, DataTypes } = require("sequelize");

const TokenModel = sequelize.define("token", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("active", "expired"),
    allowNull: false,
    defaultValue: "active", // Default status is 'active'
  },
});

module.exports = TokenModel;
