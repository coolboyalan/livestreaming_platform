const errorHandler = require("../error");
const creatorController = require("./creatorController");
const commonController = require("./commonController");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const studioModel = require("../models/studioModel");

async function login(userData) {
  try {
    const category = "studio";
    const loggedInUser = await commonController.login(userData, category);
    return loggedInUser;
  } catch (err) {
    errorHandler(err);
  }
}

async function create(userData) {
  try {
    if (userData.category !== "studio") {
      const err = {
        status: 400,
        message: "Invalid Route",
      };
      return errorHandler(err);
    }
    const hashedPass = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPass;
    const savedUser = await userModel.create(userData);
    delete userData.password;
    const studioData = await studioModel.create(userData);
    const { id } = studioData;
    savedUser.studio = id;
    await savedUser.save();
    return savedUser.toJSON();
  } catch (err) {
    errorHandler(err);
  }
}

const createCreatorUnderStudio = async (creatorData) => {
  try {
    const studioId = "XYZ"; //TODO:find out a way to implent auth and map correctly;
    creatorData.studioId = studioId;
    creatorData.isStudioAccount = true;
    const creator = await creatorController.createUser(creatorData);
    return creator;
  } catch (err) {
    errorHandler(err);
  }
};

const suspendCreatorAccount = async (creatorId) => {
  try {
    return;
  } catch (err) {}
};

const deleteCreatorAccount = async () => {
  try {
    return;
  } catch (err) {}
};

module.exports = {
  createCreatorUnderStudio,
  login,
  create
};
