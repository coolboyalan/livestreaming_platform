const sequelize = require("../db");
const { Sequelize, DataTypes } = require("sequelize");

const videoModel = sequelize.define("video", {
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING,
  },
});

module.exports = videoModel;
