const sequelize = require("../db");
const { Sequelize, DataTypes } = require("sequelize");
const TokenModel = require("./tokenModel");
const creatorModel = require("./creatorModel");

const WithdrawModel = sequelize.define("withdraw", {
  tokenQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("in process", "success", "failed","rejected"),
    allowNull: false,
    defaultValue:"in process"
  },
});

module.exports = WithdrawModel;
