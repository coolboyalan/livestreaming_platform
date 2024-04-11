const config = require("./config");
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(config.development);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

sequelize.sync({force:true}).catch((err) => {
  console.log(err.message);
});

module.exports = sequelize;
