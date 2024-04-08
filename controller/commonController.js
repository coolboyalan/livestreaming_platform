const userModel = require("../models/userModel");
const errorHandler = require("../error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const err = {};

async function login(userData, category) {
  try {
    const { username, password } = userData;
    const data = await userModel.findOne({ where: { username } });
    let user;
    if (data) {
      user = data.toJSON();
    }
    if (!data || user.category !== category || user.isDeleted) {
      err.status = 404;
      err.message = `There is no ${category} with this username`;
      return errorHandler(err);
    }
    if (user.isSuspended) {
      err.status = 403;
      err.message = `Your ${category} account has been suspended`;
      return errorHandler(err);
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      err.status = 401;
      err.message = "Incorrect Password";
      return errorHandler(err);
    }

    const categoryKey = `${category}Id`;
    const categoryValue = user[categoryKey];

    const tokenData = {
      id: user.id,
      isAdult: user.isAdult,
      category: user.category,
      totalWatchTime: user.totalWatchTime,
      [categoryKey]: categoryValue,
    };

    const token = jwt.sign(tokenData, process.env.JWT, {
      expiresIn: "1d",
    });

    const response = {
      status: true,
      message: "User logged in successfully",
      token,
      tokenData,
    };
    return response;
  } catch (err) {
    errorHandler(err);
  }
}

module.exports = {
  login,
};
