const errorHandler = require("../error");
const TokenModel = require("../models/tokenModel");

const getTokenPackages = async (r) => {
  try {
    const tokens = await TokenModel.findAll();
    return tokens.toJSON();
  } catch (error) {
    errorHandler(error);
  }
};

async function createTokenPackage(tokenData) {
  try {
    const token = await TokenModel.create(tokenData);
    return token.toJSON();
  } catch (err) {
    errorHandler(err);
  }
}

module.exports = {
  getTokenPackages,
};
