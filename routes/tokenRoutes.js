const express = require("express");
const router = express.Router();
const tokenController = require("../controller/tokenController");
const httpStatus = require("http-status");

router.route("/getToken").get(getTokenPackages);
router.route("/create").get(createToken);

async function getTokenPackages(req, res, next) {
  try {
    const tokens = await tokenController.getTokenPackages();
    res.status(200).json(tokens);
  } catch (err) {
    next(err);
  }
}

async function createToken(req, res, next) {
  try {
    const tokenData = req.body;
    const tokenPackage = await tokenController.createToken(tokenData);
    res.status(httpStatus.CREATED).json(tokenPackage);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
