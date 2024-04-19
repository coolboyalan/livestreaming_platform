// Import necessary modules
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Category = sequelize.define("Category", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  subCategories: {
    type: DataTypes.JSON,
  },
});

module.exports = Category;
