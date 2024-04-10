const express = require("express");
const router = express.Router();
const tokenController = require("../controller/tokenController");

router.route("/getToken").get(getTokenPackages);

async function getTokenPackages(req, res, next) {
  try {
    const tokens = await tokenController.getTokenPackages();
    res.status(200).json(tokens);
  } catch (err) {
    next();
  }
}

module.exports = router;
