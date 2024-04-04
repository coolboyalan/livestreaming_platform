const userModel = require("../models/userModel");
const creatorModel = require("../models/creatorModel");
const descriptionModel = require("../models/descriptionModel");
const videoModel = require("../models/videoModel");
const commonController = require("./commonController");
const bcrypt = require("bcrypt");
const errorHandler = require("../error");
const MyError = require("../error");

async function createUser(userData) {
  try {
    if (userData.category === "viewer") {
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
    const creatorData = await addCreator(userData);
    const { id } = creatorData;
    savedUser.creatorId = id;
    await savedUser.save();
    return savedUser.toJSON();
  } catch (err) {
    errorHandler(err);
  }
}

async function createDescription(descriptionData, userId) {
  try {
    const savedData = await descriptionModel.create(descriptionData);
    return savedData;
  } catch (err) {
    errorHandler(err);
  }
}

async function addCreator(userData) {
  try {
    const savedCreator = await creatorModel.create(userData);
    const { happyMe, sadMe, aboutMe, onlineTime } = userData;
    const { id: creatorId } = savedCreator.toJSON();
    const descriptionData = { happyMe, sadMe, aboutMe, onlineTime, creatorId };

    const savedDescriptionData = (
      await createDescription(descriptionData)
    ).toJSON();
    const descriptionId = savedDescriptionData.id;

    savedCreator.descriptionId = descriptionId;
    await savedCreator.save();
    return savedCreator;
  } catch (err) {
    errorHandler(err);
  }
}

async function creatorLogin(userData) {
  try {
    const loggedInUser = await commonController.login(userData);
    return loggedInUser;
  } catch (err) {
    errorHandler(err);
  }
}

async function creatorDetails(userId) {
  try {
    const creator = await creatorModel.findOne({
      where: { id: userId },
      include: [userModel, descriptionModel],
    });
    if (!creator) {
      const error = {
        status: 404,
        message: "there is no data for this creator",
      };
      throw new MyError(error);
    }
    const creatorData = creator.toJSON();
    return creatorData;
  } catch (err) {
    errorHandler(err);
  }
}

async function getLiveCreators(contentCategory) {
  try {
    const script = {};

    if (contentCategory) {
      script.where = { contentCategory };
    }
    const creators = await creatorModel.findAll(script);
    if (!creators) {
      const error = {
        status: 404,
        message: "there is no data for this creator",
      };
      throw new MyError(error);
    }
    const creatorData = creators.toJSON();
    return creatorData;
  } catch (err) {
    errorHandler(err);
  }
}

async function getAllVideosByCreator(userId) {
  try {
    const allVideos = await videoModel.findAll({ where: { userId } });
  } catch (err) {
    errorHandler(err);
  }
}

async function deleteCreatorAccount(id) {
  try {
    const creator = await creatorModel.findOne({ where: { id } });
    creator.isDeleted = true;
    await creator.save();
  } catch (err) {
    errorHandler(err);
  }
}

module.exports = {
  createUser,
  creatorLogin,
  creatorDetails,
  getLiveCreators,
  addCreator,
  getAllVideosByCreator,
};
