const bcrypt = require("bcrypt");
const httpStatus = require("http-status");
const errorHandler = require("../error");
const User = require("../models/userModel");
const { Op } = require("sequelize");

async function signUp(userData) {
  const { username, email, isAdult, category,contentCategory } = userData;
  let { password } = userData;

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      const err = {
        status: httpStatus.CONFLICT,
        message: "Email already exists.",
      };
      if (existingUser.username === username) {
        err.message = "Username already exists";
      }

      return errorHandler(err);
    }

    password = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password,
      isAdult,
      category,
      contentCategory
    });

    return newUser.toJSON();
  } catch (err) {
    errorHandler(err);
  }
}

async function getUser(userId) {
  try {
    const user = await User.findByPk(userId);
    return user;
  } catch (err) {
    errorHandler(err);
  }
}

async function updateUser(userId, newData) {
  try {
    const [rowsUpdated, [updatedUser]] = await User.update(newData, {
      where: { id: userId },
      returning: true,
    });

    if (rowsUpdated === 0) {
      const err = {
        status: httpStatus.BAD_REQUEST,
        message: "User not updated",
      };
      return errorHandler(err);
    }

    return updatedUser.toJSON();
  } catch (err) {
    errorHandler(err);
  }
}

module.exports = {
  signUp,
  updateUser,
  getUser
};
