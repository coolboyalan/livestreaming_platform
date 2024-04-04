const express = require("express");
const router = express.Router();
const creatorRoutes = require("./creatorRoutes");
const studioRoutes = require("./studioRoutes");
const viewerRoutes = require("./viewerRoutes");

router.use("/viewer/", viewerRoutes);
router.use("/creator/", creatorRoutes);
router.use("/studio/", studioRoutes);

module.exports = router;
