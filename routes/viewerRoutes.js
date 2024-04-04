const express = require("express");
const router = express.Router();
const viewerController = require("../controller/viewerController");
const schemaValidator = require("../middleware/schemaValidator");

router
  .route("/create")
  .post(schemaValidator("registrationSchema"), createViewer);

router.route("/details/:viewerId").get(getViewer);

router.route("/login").post(schemaValidator("loginSchema"), login);

async function createViewer(req, res, next) {
  try {
    const userData = req.body;
    const savedUser = await viewerController.createUser(userData);
    res.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
}

async function getViewer(req, res, next) {
  try {
    const viewerId = req.params.viewerId;
    const viewer = await viewerController.getViewer(viewerId);
    res.status(200).json(viewer);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const loginData = req.body;
    const loggedInUser = await viewerController.viewerLogin(loginData);
    res.status(200).json(loggedInUser);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
