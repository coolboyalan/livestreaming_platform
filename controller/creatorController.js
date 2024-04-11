const userModel = require("../models/userModel");
const creatorModel = require("../models/creatorModel");
const descriptionModel = require("../models/descriptionModel");
const videoModel = require("../models/videoModel");
const studioModel = require("../models/studioModel");
const commonController = require("./commonController");
const withdrawController = require("./withdrawController");
const bcrypt = require("bcrypt");
const errorHandler = require("../error");
const fs = require("fs");
const path = require("path");
const WithdrawModel = require("../models/withdrawModel");

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
    const category = "creator";
    const loggedInUser = await commonController.login(userData, category);
    return loggedInUser;
  } catch (err) {
    errorHandler(err);
  }
}

async function updateCreator(creatorData) {
  try {
    const creator = await creatorDetails(creatorId);
    await creator.update(creatorData);
    return creator.toJSON();
  } catch (err) {
    errorHandler(err);
  }
}

async function getCreator(creatorId) {
  try {
    const creator = await creatorModel.findByPk(creatorId);
    if (!creator) {
      const err = {
        status: 404,
        message: "there is no creator with this id",
      };
      return errorHandler(err);
    }
    return creator.toJSON();
  } catch (err) {
    errorHandler(err);
  }
}

async function getAllCreators() {
  try {
    const creators = await creatorModel.findAll({
      where: { isVerified: true },
      attributes: ["id", "firstName", "lastName", "profilePicture"],
    });
    return creators.toJSON();
  } catch (err) {
    errorHandler(err);
  }
}

async function creatorDetails(creatorId) {
  try {
    const creator = await creatorModel.findOne({
      where: { id: creatorId },
      include: [userModel, descriptionModel, videoModel, studioModel],
    });
    if (!creator) {
      const error = {
        status: 404,
        message: "creator doesn't exist",
      };
      return errorHandler(error);
    }
    const creatorData = creator.toJSON();
    return creatorData;
  } catch (err) {
    errorHandler(err);
  }
}

async function getLiveCreators(contentCategory) {
  try {
    const options = {
      where: {
        isLive: true,
      },
    };

    // Add condition for content category if provided
    if (contentCategory) {
      options.where.contentCategory = contentCategory;
    }
    const creators = await creatorModel.findAll(options);
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

async function getLiveStreamCredentials(creatorId) {
  try {
    const creator = await creatorModel.findOne({
      where: {
        id: creatorId,
      },
      attributes: ["id", "streamKey", "isVerified"],
    });

    if (!creator.isVerified) {
      const err = {
        status: 403,
        message: "please verify your account to get access to live stream",
      };
      return errorHandler(err);
    }
    creator.streamKey = "test";
    await creator.save();
    return creator;
  } catch (err) {
    errorHandler(err);
  }
}

async function getAllVideosByCreator(creatorId) {
  try {
    const allVideos = await videoModel.findAll({ where: { creatorId } });
    return allVideos.toJSON();
  } catch (err) {
    errorHandler(err);
  }
}

async function udpateLiveStatus(creatorId, status) {
  try {
    const creator = await creatorModel.findByPk(creatorId);
    creator.isLive = status;
    if (!status) {
      creator.streamKey = null;
    }
    await creator;
  } catch (err) {
    errorHandler(err);
  }
}

async function updateVideoDetails(videoData, videoThumbnail) {
  try {
    const { id } = videoData;
    const video = await videoModel.findOne({ where: { id } });

    const err = {};

    if (!video) {
      err.status = 404;
      err.message = "There is no video with this id";
      return errorHandler(err);
    }

    let destinationPath;
    if (videoThumbnail) {
      destinationPath = path.join("../media", file.originalname);
      fs.rename(file.path, destinationPath, (err) => {
        if (err) {
          err.status = 500;
          err.message = "Error occurred while uploading file.";
          return errorHandler(err);
        }
        console.log(`File ${file.originalname} uploaded successfully.`);
      });
    }
  } catch (err) {
    errorHandler(err);
  }
}

async function updateTokens(creatorId, tokens,internal) {
  try {
    const creator = await creatorModel.findByPk(creatorId);
    creator.availableTokens += tokens;
    if (tokens > 0 && !internal) {
      creator.earnedTokens += tokens;
    }
    await creator.save();
    return creator.toJSON();
  } catch (err) {
    errorHandler(err);
  }
}

async function withdrawTokens(creatorId, withdrawData) {
  try {
    const creator = await creatorModel.findByPk(creatorId);
    const { tokenQuantity } = withdrawData;
    const { availableTokens } = creator.toJSON();
    if (tokenQuantity > availableTokens) {
      const err = {
        status: 404,
        message: "You don't have enough tokens to withdraw",
      };
      return errorHandler(err);
    }

    withdraw.creatorId = creatorId;
    withdraw.amount = tokenQuantity * 0.05;

    const withdraw = await withdrawController.createWithdraw(withdrawData);
    return withdraw;
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
  getLiveStreamCredentials,
  addCreator,
  getAllVideosByCreator,
  updateCreator,
  getAllCreators,
  udpateLiveStatus,
  updateTokens,
  getCreator,
};
