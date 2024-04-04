const express = require("express");
const router = express.Router();
const creatorController = require("../controller/creatorController");
const schemaValidator = require("../middleware/schemaValidator");
const {
  authentication,
  authorization,
} = require("../middleware/authentication");
const errorHandler = require("../error");

router.route("/details").get(authentication, authorization, getCreatorData);

router.route("/liveCreators/:contentCategory").get(getLiveCreators);
router.route("/videos").get(getAllVideosByCreator);

router.route("/create").post(schemaValidator("registrationSchema"), createUser);

router
  .route("/update")
  .put(schemaValidator("additionalDetailsSchema"), saveAdditionalDetails);

router.route("/login").post(schemaValidator("loginSchema"), login);

async function getCreatorData(req, res, next) {
  try {
    const { userId } = req.user;
    const creatorData = await creatorController.creatorDetails(userId);
    res.status(200).json({ status: true, data: creatorData });
  } catch (err) {
    next(err);
  }
}

async function getLiveCreators(req, res, next) {
  try {
    const contentCategory = req.params.contentCategory;
    const creators = await creatorController.getLiveCreators(contentCategory);
    res.status(200).json({ status: true, data: creators });
  } catch (err) {
    next(err);
  }
}

async function getAllVideosByCreator(req, res, next) {
  try {
    // TODO: figure out how to do it in a better way when integrating with the frontend
    const user = req.user;
    const videos = await creatorController.getAllVideosByCreator(user);
    res.status(200).json({ status: true, data: videos });
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res,next) {
  try {
    const userData = req.body;
    const savedUser = await creatorController.createUser(userData);
    res.status(201).json({ status: true, data: savedUser });
  } catch (err) {
    next(err)
  }
}

async function login(req, res,next) {
  try {
    const userData = req.body;
    const loggedInUser = await creatorController.creatorLogin(userData);
    res.status(200).json({ status: true, data: loggedInUser });
  } catch (err) {
    next(err)
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

module.exports = router;
