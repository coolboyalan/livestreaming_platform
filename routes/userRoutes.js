const express = require("express");
const router = express.Router();
const httpStatus = require("http-status");
const userController = require("../controller/userController");
const schemaValidator = require("../middleware/schemaValidator");
const valid = require("../validations/validationSchema");
const commonController = require("../controller/commonController");

// SIGNUP ROUTES
router.post(
  "/viewer/create",
  schemaValidator(valid.viewerSignUpSchema),
  signUp
);
router.post(
  "/creator/create",
  schemaValidator(valid.creatorSignUpSchema),
  signUp
);
router.post(
  "/studio/create",
  schemaValidator(valid.studioSignUpSchema),
  signUp
);

// AUTHENTICATION / LOGIN ROUTES
router.route("/authenticate").get(authenticate);
router.post("/viewer/login", schemaValidator(valid.viewerLoginSchema), login);
router.post("/creator/login", schemaValidator(valid.creatorLoginSchema), login);
router.post("/studio/login", schemaValidator(valid.studioLoginSchema), login);

async function authenticate(req, res, next) {
  try {
    const { auth: authToken } = req.headers;
    const loggedInUser = await commonController.authenticate(authToken);
    res.status(200).json(loggedInUser);
  } catch (err) {
    next(err);
  }
}

async function signUp(req, res, next) {
  try {
    const userData = req.body;
    const user = await userController.signUp(userData);
    res.status(httpStatus.CREATED).json(user);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const loginData = req.body;
    const loggedInUser = userController.login(loginData);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
