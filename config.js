const Sequelize = require("sequelize");

module.exports = {
  development: {
    username: "root",
    password: "root",
    database: "tomtest",
    host: "127.0.0.1",
    port: 3306,
    dialect: "mysql",
  },
};

// module.exports = {
//   development: {
//     username: "webaawln_tomtest",
//     password: "f%02S.$-l9x+",
//     database: "webaawln_tomtest",
//     host: "localhost",
//     port: 3306,
//     dialect: "mysql",
//   },
// };