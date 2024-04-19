const express = require("express");
const httpStatus = require("http-status");
const router = express.Router();
const creatorController = require("../controller/creatorController");
const schemaValidator = require("../middleware/schemaValidator");
const valid = require("../validations/validationSchema");
const { authenticate, authorization } = require("../middleware/authentication");

router
  .route("/details/personal")
  .get(authenticate, authorization, getCreatorPersonalData);

router.route("/details/:id").get(getCreatorData);

router.route("/all").get(getAllCreators);
//
router.route("/liveCreators").get(getLiveCreators);
router.route("/liveCreators/:contentCategory").get(getLiveCreators);

router
  .route("/create")
  .post(schemaValidator(valid.additionalDetailsSchema), createUser);

router.route("/login").post(schemaValidator(valid.creatorLoginSchema), login);

router
  .route("/live")
  .get(authenticate, authorization, getLiveStreamCredentials);

// router
//   .route("/update")
//   .put(schemaValidator("additionalDetailsSchema"), saveAdditionalDetails);

router.route("/videos").get(getAllVideosByCreator);
router.route("/videos/:creatorId").get(getAllVideosByCreator);
// router
//   .route("/videos/edit/:videoId")
//   .put(authentication, authorization, updateVideoDetails);

// router.route("/withdraw").post(withdrawTokens);
// router.post("/uploadLivePhoto", upload.single("photo"), uploadLivePhoto);

async function getCreatorData(req, res, next) {
  try {
    const { id } = req.params;
    const creatorData = await creatorController.creatorDetails(id);
    res.status(httpStatus.OK).json(creatorData);
  } catch (err) {
    next(err);
  }
}

async function getAllCreators(req, res, next) {
  try {
    const creators = await creatorController.getAllCreators();
    res.status(httpStatus.OK).json(creators);
  } catch (err) {
    next(err);
  }
}

async function getCreatorPersonalData(req, res, next) {
  try {
    const { creatorId } = req.user;
    const creatorData = await creatorController.creatorDetails(creatorId);
    res.status(httpStatus.OK).json({ status: true, data: creatorData });
  } catch (err) {
    next(err);
  }
}

async function getLiveCreators(req, res, next) {
  try {
    const { contentCategory } = req.params;
    const creators = await creatorController.getLiveCreators(contentCategory);
    res.status(httpStatus.OK).json({ status: true, data: creators });
  } catch (err) {
    next(err);
  }
}

async function getAllVideosByCreator(req, res, next) {
  try {
    const { creatorId } = req.params;
    const videos = await creatorController.getAllVideosByCreator(creatorId);
    res.status(httpStatus.OK).json({ status: true, data: videos });
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const userData = req.body;
    userData.files = req.files;
    const userId = req.session.user.userId;
    const savedUser = await creatorController.createUser(userId, userData);
    const { user, creator } = savedUser;
    req.session.user = user;
    const response = {
      // TODO: change to cretor
      name: `${creator.firstName} ${creator.lastName}`,
      email: user.email,
      phone: creator.taxNo,
      address: creator.city,
      loggedIn:true
    };
    res.render("profile",response);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const userData = req.body;
    const loggedInUser = await creatorController.login(userData);
    req.session.user = loggedInUser;
    res.redirect("creators");
  } catch (err) {
    next(err);
  }
}

// async function saveAdditionalDetails(req, res) {
//   try {
//     const userData = req.body;
//     const creatorId = jwt.verify(req.headers.auth, "mySecreKey").creatorId;
//     userData.creatorId = creatorId;
//     const savedUser = await creatorController.updateCreator(userData);
//     res.status(201).json({ status: true, data: savedUser });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err.message);
//   }
// }

async function getLiveStreamCredentials(req, res, next) {
  try {
    const { creatorId } = req.user;
    const LiveStreamCredentials =
      await creatorController.getLiveStreamCredentials(creatorId);
    res.status(200).json({ status: true, data: LiveStreamCredentials });
  } catch (err) {
    next(err);
  }
}

// async function updateVideoDetails(req, res, next) {
//   try {
//     const videoData = req.body;
//     const videoThumbnail = req.file;
//     const updatedVideo = await creatorController.updateVideoDetails(
//       videoData,
//       videoThumbnail
//     );
//     res.status(200).json(updatedVideo);
//   } catch (err) {
//     next(err);
//   }
// }

// async function withdrawTokens(req, res, next) {
//   try {
//     const { creatorId } = req.user;
//     const withdrawData = req.body;
//     const updatedWithdrawData = await creatorController.withdrawTokens(
//       creatorId,
//       withdrawData
//     );
//     res.status(200).json(updatedWithdrawData);
//   } catch (err) {
//     next(err);
//   }
// }

// async function uploadLivePhoto(req, res, next) {
//   try {
//     // Check if file is provided
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded." });
//     }

//     // File upload successful, return file details
//     const { filename, originalname, mimetype, size } = req.file;
//     return res.status(200).json({ filename, originalname, mimetype, size });
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     return res.status(500).json({ message: "Error uploading file." });
//   }
// }

module.exports = router;
