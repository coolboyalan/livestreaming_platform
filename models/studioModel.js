const sequelize = require("../db");
const { Sequelize, DataTypes } = require("sequelize");

const studioModel = sequelize.define("studio", {
  contentCategory: {
    type: DataTypes.STRING,
    allowNull: false,
    // TODO: to be discussed whether to go with pre-defined category or what
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  studioName: {
    type: DataTypes.STRING,
  },
  studioUrl: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true,
    },
  },
  accountOwner: {
    type: DataTypes.ENUM({
      values: ["Individual", "Company"],
    }),
  },
  additionalContact: {
    type: DataTypes.STRING,
  },
  companyName: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profilePicture: {
    type: DataTypes.STRING,
  },
  sex: {
    type: DataTypes.ENUM({
      values: ["Male", "Female", "Others"],
    }),
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM({
      values: ["studio"],
    }),
    allowNull: false,
  },
  nativeLanguage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
    },
  },
  governmentIdNo: {
    type: DataTypes.STRING,
  },
  idPhoto: {
    type: DataTypes.STRING,
  },
  idVerificationPhoto: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  countryOfResidence: {
    type: DataTypes.STRING,
    allowNull: false,
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
});

module.exports = studioModel;
