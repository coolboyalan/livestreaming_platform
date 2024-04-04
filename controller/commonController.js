const userModel = require("../models/userModel");
const errorHandler = require("../error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function login(userData, category) {
  try {
    const { username, password } = userData;
    const data = await userModel.findOne({ where: { username } });
    let user;
    if (data) {
      user = data.toJSON();
    }
    if (!data || user.category !== category) {
      const err = {
        status: 404,
        message: `There is no ${category} with this username`,
      };
      return errorHandler(err);
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const err = {
        status: 401,
        message: "Incorrect Password",
      };
      return errorHandler(err);
    }
    const token = jwt.sign(user, process.env.JWT, {
      expiresIn: "1d",
    });
    const response = {
      status: true,
      message: "User logged in successfully",
      token,
      user,
    };
    return response;
  } catch (err) {
    errorHandler(err);
  }
}

module.exports = {
  login,
};
