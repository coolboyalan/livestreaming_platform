const express = require("express");
const router = express.Router();
const studioController = require("../controller/studioController");

router.route("/create").post(createCreatorUnderStudio);

async function createCreatorUnderStudio(req, res, next) {
  try {
    const creatorData = req.body;
    const savedCreatorData = await creatorController.createCreatorUnderStudio(
      creatorData
    );
    res.status(201).json({ status: true, data: savedCreatorData });
  } catch (err) {
    next(err);
  }
}

module.exports = router;
