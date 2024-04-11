const express = require("express");
const router = express.Router();
const creatorController = require("../controller/creatorController");
const schemaValidator = require("../middleware/schemaValidator");
const {
  authentication,
  authorization,
} = require("../middleware/authentication");

router
  .route("/details/personal")
  .get(authentication, authorization, getCreatorPersonalData);
router.route("/details/:id").get(getCreatorData);

router.route("/all").get(getAllCreators);

router.route("/liveCreators/:contentCategory").get(getLiveCreators);

router.route("/create").post(schemaValidator("registrationSchema"), createUser);
router
  .route("/live")
  .get(authentication, authorization, getLiveStreamCredentials);

router
  .route("/update")
  .put(schemaValidator("additionalDetailsSchema"), saveAdditionalDetails);

router.route("/login").post(schemaValidator("loginSchema"), login);

router.route("/videos").get(getAllVideosByCreator);
router.route("/videos/:creatorId").get(getAllVideosByCreator);
router
  .route("/videos/edit/:videoId")
  .put(authentication, authorization, updateVideoDetails);

router.route("/withdraw").post(withdrawTokens);

async function getCreatorData(req, res, next) {
  try {
    const { id } = req.params;
    const creatorData = await creatorController.creatorDetails(id);
    res.status(200).json({ status: true, data: creatorData });
  } catch (err) {
    next(err);
  }
}

async function getAllCreators(req, res, next) {
  try {
    const creators = await creatorController.getAllCreators();
    res.status(200).json(creators);
  } catch (err) {
    next(err);
  }
}

async function getCreatorPersonalData(req, res, next) {
  try {
    const { creatorId } = req.user;
    const creatorData = await creatorController.creatorDetails(creatorId);
    res.status(200).json({ status: true, data: creatorData });
  } catch (err) {
    next(err);
  }
}

async function getLiveCreators(req, res, next) {
  try {
    const { contentCategory } = req.params;
    const creators = await creatorController.getLiveCreators(contentCategory);
    res.status(200).json({ status: true, data: creators });
  } catch (err) {
    next(err);
  }
}

async function getAllVideosByCreator(req, res, next) {
  try {
    const { creatorId } = req.params;
    const videos = await creatorController.getAllVideosByCreator(creatorId);
    res.status(200).json({ status: true, data: videos });
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const userData = req.body;
    const savedUser = await creatorController.createUser(userData);
    res.status(201).json({ status: true, data: savedUser });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const userData = req.body;
    const loggedInUser = await creatorController.creatorLogin(userData);
    res.status(200).json({ status: true, data: loggedInUser });
  } catch (err) {
    next(err);
  }
}

async function saveAdditionalDetails(req, res) {
  try {
    const userData = req.body;
    const savedUser = await creatorController.saveAdditionalDetails(userData);
    res.status(201).json({ status: true, data: savedUser });
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
}

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

async function updateVideoDetails(req, res, next) {
  try {
    const videoData = req.body;
    const videoThumbnail = req.file;
    const updatedVideo = await creatorController.updateVideoDetails(
      videoData,
      videoThumbnail
    );
    res.status(200).json(updatedVideo);
  } catch (err) {
    next(err);
  }
}

async function withdrawTokens(req, res, next) {
  try {
    const { creatorId } = req.user;
    const withdrawData = req.body;
    const updatedWithdrawData = await creatorController.withdrawTokens(
      creatorId,
      withdrawData
    );
    res.status(200).json(updatedWithdrawData);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
