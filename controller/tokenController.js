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


module.exports = {
  getTokenPackages,
};
