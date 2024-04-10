const sequelize = require("../db");
const { Sequelize, DataTypes } = require("sequelize");
const TokenModel = require("./tokenModel");
const UserModel = require("./userModel");

const PaymentModel = sequelize.define("Payment", {
  tokenQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UserModel,
      key: "id",
    },
  },
  category: {
    type: DataTypes.ENUM("viewer", "creator", "studio"),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending","success","failed"),
    allowNull: false,
  },
  tokenId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TokenModel,
      key: "id",
    },
  },
});

PaymentModel.belongsTo(TokenModel, { foreignKey: "tokenId" });
PaymentModel.belongsTo(UserModel, { foreignKey: "userId" });

module.exports = PaymentModel;
