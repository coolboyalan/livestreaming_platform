const Sequelize = require("sequelize");

module.exports = {
  development: {
    username: "root",
    password: "root",
    database: "test",
    host: "localhost",
    port: 3306,
    dialect: "mysql",
  },
};
