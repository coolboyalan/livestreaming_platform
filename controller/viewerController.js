const userModel = require("../models/userModel");
const errorHandler = require("../error");
const viewerModel = require("../models/viewerModel");
const commonController = require("./commonController");
const bcrypt = require("bcrypt");

async function createUser(userData) {
  try {
    const { username, email, password, isAdult, category } = userData;
    const allowedUserData = { username, email, password, isAdult, category };
    if (category !== "viewer") {
      const err = {
        status: 400,
        message: "Invalid Route",
      };
      return errorHandler(err);
    }
    const hashedPass = await bcrypt.hash(password, 10);
    allowedUserData.password = hashedPass;
    const savedUser = await userModel.create(allowedUserData);
    return savedUser.toJSON();
  } catch (err) {
    errorHandler(err);
  }
}

async function createViewer(userId,viewerData) {
  try {
    const savedViewer = await viewerModel.create(viewerData);
    return savedViewer.toJSON();
  } catch (err) {
    errorHandler(err);
  }
}

async function getViewer(userId) {
  try {
    const viewer = await viewerModel.findOne({ where: { id: viewerId } });
    return viewer.toJSON();
  } catch (err) {
    errorHandler(err);
  }
}

async function viewerLogin(viewerData) {
  try {
    const category = "viewer"
    const loggedInUser = await commonController.login(viewerData,category);
    return loggedInUser;
  } catch (err) {
    errorHandler(err);
  }
}

module.exports = {
  createUser,
  getViewer,
  viewerLogin,
};
