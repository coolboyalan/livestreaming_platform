const sequelize = require("../db");
const { Sequelize, DataTypes } = require("sequelize");
const userModel = require("./userModel");

const viewerModel = sequelize.define(
  "viewer",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isAdult: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM({
        values: ["viewer"],
      }),
      allowNull: false,
    },
    totalWatchTIme: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isSuspended: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    token: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { timestamps: true }
);

// // viewerModel.hasOne(userModel, { foreignKey: "viewerId" });

module.exports = viewerModel;
