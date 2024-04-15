const sequelize = require("../db");
const { Sequelize, DataTypes } = require("sequelize");
const User = require("./userModel");
const descriptionModel = require("./descriptionModel");
const videoModel = require("./videoModel");
const studioModel = require("./studioModel");
const viewerModel = require("./viewerModel");
const PaymentModel = require("./paymentModel");
const WithdrawModel = require("./withdrawModel");

const creatorModel = sequelize.define("creator", {
  descriptionId: {
    type: DataTypes.INTEGER,
  },
  contentCategory: {
    type: DataTypes.STRING,
    // TODO: to be discussed whether to go with pre-defined category or what
    allowNull:false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull:false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull:false
  },
  email: {
    type: DataTypes.STRING,
    unique:true,
    allowNull:false
  },
  profilePicture: {
    type: DataTypes.STRING,
  },
  governmentIdPicture:{
    type:DataTypes.STRING,
  },
  photoVerification:{
    type:DataTypes.STRING,
  },
  sex: {
    type: DataTypes.ENUM({
      values: ["Male", "Female", "Others"],
    }),
    allowNull:false
  },
  category: {
    type: DataTypes.ENUM({
      values: ["creator"],
    }),
    allowNull: false,
  },
  nativeLanguage: {
    type: DataTypes.STRING,
    allowNull:false
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull:false
  },
  governmentIdNo: {
    type: DataTypes.STRING,
    allowNull:false
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
  streamKey: {
    type: DataTypes.STRING,
  },
  isStudioAccount: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  studioId: {
    type: DataTypes.INTEGER,
    defaultValue:null
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  earnedTokens: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  availableTokens: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
});

creatorModel.hasOne(User);
creatorModel.hasOne(descriptionModel);
creatorModel.hasMany(videoModel);
studioModel.hasMany(creatorModel);
creatorModel.belongsTo(studioModel);
studioModel.hasOne(User);
viewerModel.hasOne(User);
creatorModel.hasMany(WithdrawModel);


User.belongsTo(viewerModel, { foreignKey: "viewerId" });
User.belongsTo(creatorModel, { foreignKey: "creatorId" });
User.belongsTo(studioModel, { foreignKey: "studioId" });

viewerModel.hasOne(User, { foreignKey: "viewerId" });
creatorModel.hasOne(User, { foreignKey: "creatorId" });
studioModel.hasOne(User, { foreignKey: "studioId" });

module.exports = creatorModel;