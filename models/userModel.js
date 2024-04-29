const sequelize = require("../db");
const { Sequelize, DataTypes } = require("sequelize");

const User = sequelize.define(
  "user",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdult: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM({
        values: ["creator", "studio", "viewer"],
      }),
      allowNull: false,
    },
    contentCategory: {
      type: DataTypes.STRING,
      defaultValue:'Viewer'
    },
    viewerId: {
      type: DataTypes.INTEGER,
    },
    creatorId: {
      type: DataTypes.INTEGER,
    },
    studioId: {
      type: DataTypes.INTEGER,
    },
    followers: {
      type: DataTypes.JSON,
    },
    following: {
      type: DataTypes.JSON,
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
  },
  { timestamps: true }
);

module.exports = User;
