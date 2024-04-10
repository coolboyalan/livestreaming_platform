const sequelize = require("../db");
const { Sequelize, DataTypes } = require("sequelize");

const videoModel = sequelize.define("video", {
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: new Date(),
  },
  location: {
    type: DataTypes.STRING,
  },
  tokenAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  tokenRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING,
  },
});

module.exports = videoModel;
