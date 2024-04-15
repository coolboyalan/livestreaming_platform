const sequelize = require("../db");
const { Sequelize, DataTypes } = require("sequelize");

const AdminModel = sequelize.define('Admin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: true // Assuming all admins are by default admins, you can adjust this based on your needs
    },
    roles: {
      type: DataTypes.JSON // Assuming roles will be stored as an array of strings
    }
  });

  module.exports = AdminModel;