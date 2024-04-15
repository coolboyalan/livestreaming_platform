const express = require("express");
const router = express.Router();
const studioController = require("../controller/studioController");
const valid = require("../validations/validationSchema");
const schemaValidator = require("../middleware/schemaValidator");

router.route("/createCreator").post(createCreatorUnderStudio);

router.route("/create").post(create);
// router.route("/saveDetails").post(saveStudioDetails);

router.route("/login").post(schemaValidator(valid.studioLoginSchema), login);

async function createCreatorUnderStudio(req, res, next) {
  try {
    const creatorData = req.body;
    const savedCreatorData = await studioController.createCreatorUnderStudio(
      creatorData
    );
    res.status(201).json({ status: true, data: savedCreatorData });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const studioData = req.body;
    const savedStudioData = await studioController.create(studioData);
    res.status(201).json({ status: true, data: savedStudioData });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const userData = req.body;
    const loggedInUser = await studioController.login(userData);
    res.status(200).json(loggedInUser);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
