const userModel = require("../models/userModel");
const Creator = require("../models/creatorModel");
const descriptionModel = require("../models/descriptionModel");
const videoModel = require("../models/videoModel");
const studioModel = require("../models/studioModel");
const commonController = require("./commonController");
const withdrawController = require("./withdrawController");
const userController = require("./userController");
const errorHandler = require("../error");
const fs = require("fs");
const path = require("path");
const WithdrawModel = require("../models/withdrawModel");


async function createUser(userId, userData) {
  try {
    const user = await userController.getUser(userId);

    if (!user) {
      err.message = "there is no creator, please register";
      return errorHandler(err);
    }

    if (user.category !== "creator") {
      const err = {
        status: 400,
        message: "Invalid Route",
      };
      return errorHandler(err);
    }

    if (user.creatorId !== null) {
      const err = {
        status: 403,
        message: "Please use the update feature to do this task",
      };
      return errorHandler(err);
    }
    userData.userId = user.id;
    userData.email = user.email;
    userData.category = "creator";
    userData.followers = 0;
    const creator = await addCreator(userData);
    const { id } = creator;
    const creatorId = id;
    await user.update({ creatorId });
    return { user, creator };
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
    const files = await checkedFiles(userData.userId, userData.files);
    const savedCreator = await Creator.create(userData);
    const { happyMe, sadMe, aboutMe, onlineTime } = userData;
    const { id: creatorId } = savedCreator.toJSON();
    const descriptionData = { happyMe, sadMe, aboutMe, onlineTime, creatorId };

    const savedDescriptionData = (
      await createDescription(descriptionData)
    ).toJSON();
    const descriptionId = savedDescriptionData.id;

    savedCreator.descriptionId = descriptionId;
    const filePath = await uploadFiles(userData.userId, files);
    savedCreator.profilePicture = filePath;
    await savedCreator.save();
    return savedCreator;
  } catch (err) {
    errorHandler(err);
  }
}

async function checkedFiles(userId, userFiles) {
  try {
    const fileNameArray = ["governmentIdPicture", "photoVerification"];
    let profilePicture;
    const files = userFiles.filter((file) => {
      if (fileNameArray.includes(file.fieldname)) {
        return true;
      }
      if (file.fieldname === "profilePicture") {
        profilePicture = file;
      }
    });
    if (files.length !== 2) {
      const err = {
        status: 400,
        message: "Government documents verification files missing",
      };
      return errorHandler(err);
    }
    if (profilePicture) files.push(profilePicture);

    return files;
  } catch (err) {
    errorHandler(err);
  }
}

async function uploadFiles(userId, files) {
  try {
    const uploadDir = path.join(
      __dirname,
      `../media/photos/creators/${userId}`
    );

    files.forEach(async (file) => {
      const uniqueFilename = userId + "-" + file.fieldname;

      if (!fs.existsSync(uploadDir)) {
        await fs.promises.mkdir(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, uniqueFilename);

      await fs.promises.writeFile(filePath, file.buffer);
      console.log(`File saved: ${filePath}`);
    });
    return `${uploadDir}/${userId}-profilePicture`;
  } catch (err) {
    errorHandler(err);
  }
}

async function login(userData) {
  try {
    const category = "creator";
    const loggedInUser = await commonController.login(userData, category);
    return loggedInUser;
  } catch (err) {
    errorHandler(err);
  }
}

// async function updateCreator(creatorData) {
//   try {
//     const { creatorId } = creatorData;
//     const creator = await creatorDetails(creatorId);
//     await creator.update(creatorData);
//     return creator.toJSON();
//   } catch (err) {
//     errorHandler(err);
//   }
// }

// async function getCreator(creatorId) {
//   try {
//     const creator = await Creator.findByPk(creatorId);
//     if (!creator) {
//       const err = {
//         status: 404,
//         message: "there is no creator with this id",
//       };
//       return errorHandler(err);
//     }
//     return creator.toJSON();
//   } catch (err) {
//     errorHandler(err);
//   }
// }

async function getAllCreators() {
  try {
    const creators = await Creator.findAll({
      where: { isVerified: true },
      attributes: ["id", "firstName", "lastName", "profilePicture"],
    });
    return creators;
  } catch (err) {
    errorHandler(err);
  }
}

async function creatorDetails(creatorId) {
  try {
    const creator = await Creator.findOne({
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
    return creator;
  } catch (err) {
    errorHandler(err);
  }
}

async function creatorDetails(creatorId) {
  try {
    const creator = await Creator.findOne({
      where: { id: creatorId },
      include: [
        {
          model: userModel,
          attributes: ["id", "username", "email"], // Specify the attributes you want to retrieve from the userModel
        },
        {
          model: descriptionModel,
        },
        {
          model: videoModel,
          attributes: ["title", "location"], // Specify the attributes you want to retrieve from the videoModel
        },
        {
          model: studioModel,
          attributes: ["id", "firstName", "lastName"], // Specify the attributes you want to retrieve from the studioModel
        },
      ],
    });
    if (!creator) {
      const error = {
        status: 404,
        message: "creator doesn't exist",
      };
      return errorHandler(error);
    }
    return creator;
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
    const creators = await Creator.findAll(options);
    if (!creators.length) {
      const error = {
        status: 404,
        message: "None of the creators are live",
      };
      return errorHandler(error);
    }
    return creators;
  } catch (err) {
    errorHandler(err);
  }
}

async function getLiveStreamCredentials(creatorId) {
  try {
    const creator = await Creator.findOne({
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
    const options = {};

    if (creatorId) {
      options.where = {
        creatorId,
      };
    }
    const allVideos = await videoModel.findAll(options);

    if (!allVideos.length) {
      const err = {
        status: 404,
        message: "No videos found",
      };
      return errorHandler(err);
    }

    return allVideos;
  } catch (err) {
    errorHandler(err);
  }
}

// async function udpateLiveStatus(creatorId, status) {
//   try {
//     const creator = await Creator.findByPk(creatorId);
//     creator.isLive = status;
//     if (!status) {
//       creator.streamKey = null;
//     }
//     await creator;
//   } catch (err) {
//     errorHandler(err);
//   }
// }

// async function updateVideoDetails(videoData, videoThumbnail) {
//   try {
//     const { id } = videoData;
//     const video = await videoModel.findOne({ where: { id } });

//     const err = {};

//     if (!video) {
//       err.status = 404;
//       err.message = "There is no video with this id";
//       return errorHandler(err);
//     }

//     let destinationPath;
//     if (videoThumbnail) {
//       destinationPath = path.join("../media", file.originalname);
//       fs.rename(file.path, destinationPath, (err) => {
//         if (err) {
//           err.status = 500;
//           err.message = "Error occurred while uploading file.";
//           return errorHandler(err);
//         }
//         console.log(`File ${file.originalname} uploaded successfully.`);
//       });
//     }
//   } catch (err) {
//     errorHandler(err);
//   }
// }

// async function updateTokens(creatorId, tokens, internal) {
//   try {
//     const creator = await Creator.findByPk(creatorId);
//     creator.availableTokens += tokens;
//     if (tokens > 0 && !internal) {
//       creator.earnedTokens += tokens;
//     }
//     await creator.save();
//     return creator.toJSON();
//   } catch (err) {
//     errorHandler(err);
//   }
// }

// async function withdrawTokens(creatorId, withdrawData) {
//   try {
//     const creator = await Creator.findByPk(creatorId);
//     const { tokenQuantity } = withdrawData;
//     const { availableTokens } = creator.toJSON();
//     if (tokenQuantity > availableTokens) {
//       const err = {
//         status: 404,
//         message: "You don't have enough tokens to withdraw",
//       };
//       return errorHandler(err);
//     }

//     withdraw.creatorId = creatorId;
//     withdraw.amount = tokenQuantity * 0.05;

//     const withdraw = await withdrawController.createWithdraw(withdrawData);
//     return withdraw;
//   } catch (err) {
//     errorHandler(err);
//   }
// }

// async function deleteCreatorAccount(id) {
//   try {
//     const creator = await Creator.findOne({ where: { id } });
//     creator.isDeleted = true;
//     await creator.save();
//   } catch (err) {
//     errorHandler(err);
//   }
// }

module.exports = {
  createUser,
  login,
  creatorDetails,
  getLiveCreators,
  getLiveStreamCredentials,
  addCreator,
  getAllVideosByCreator,
  // updateCreator,
  getAllCreators,
  // udpateLiveStatus,
  // updateTokens,
  // getCreator,
};
