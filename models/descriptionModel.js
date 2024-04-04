const sequelize = require("../db");
const { Sequelize, DataTypes } = require("sequelize");
const creatorModel = require("./creatorModel");

const descriptionModel = sequelize.define("description", {
  aboutMe: {
    type: DataTypes.STRING,
  },
  happyMe: {
    type: DataTypes.STRING,
  },
  sadMe: {
    type: DataTypes.STRING,
  },
  onlineTime: {
    type: DataTypes.STRING,
  },
  creatorId: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
  },
});

module.exports = descriptionModel;
