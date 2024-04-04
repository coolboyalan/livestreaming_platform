const sequelize = require("../db");
const { Sequelize, DataTypes } = require("sequelize");
const userModel = require("./userModel");
const descriptionModel = require("./descriptionModel");
const videoModel = require("./videoModel");
const studioModel = require("./studioModel");
const viewerModel = require("./viewerModel");

const creatorModel = sequelize.define("creator", {
  descriptionId: {
    type: DataTypes.INTEGER,
  },
  contentCategory: {
    type: DataTypes.STRING,
    // TODO: to be discussed whether to go with pre-defined category or what
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  profilePicture: {
    type: DataTypes.STRING,
  },
  sex: {
    type: DataTypes.ENUM({
      values: ["Male", "Female", "Others"],
    }),
  },
  category: {
    type: DataTypes.ENUM({
      values: ["creator"],
    }),
    allowNull: false,
  },
  nativeLanguage: {
    type: DataTypes.STRING,
  },
  dob: {
    type: DataTypes.DATEONLY,
  },
  governmentIdNo: {
    type: DataTypes.STRING,
  },
  governmentIdExpiryDate: {
    type: DataTypes.DATEONLY,
  },
  country: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.STRING,
  },
  postalCode: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  companyName: {
    type: DataTypes.STRING,
  },
  taxNo: {
    type: DataTypes.STRING(2000),
  },
  businessRegistrationNo: {
    type: DataTypes.STRING,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  isSuspended: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  isLive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isStudioAccount: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  studioId: {
    type: DataTypes.INTEGER,
  },
  isModdified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

creatorModel.hasOne(userModel);
creatorModel.hasOne(descriptionModel);
creatorModel.hasMany(videoModel);
studioModel.hasMany(creatorModel);
studioModel.hasOne(userModel);
viewerModel.hasOne(userModel);

module.exports = creatorModel;
