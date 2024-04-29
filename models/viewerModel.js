const sequelize = require("../db");
const { Sequelize, DataTypes } = require("sequelize");
const userModel = require("./userModel");

const viewerModel = sequelize.define(
  "viewer",
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName:{
      type: DataTypes.STRING,
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
