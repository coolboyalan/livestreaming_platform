const express = require("express");
const router = express.Router();
const creatorRoutes = require("./creatorRoutes");
const studioRoutes = require("./studioRoutes");
const viewerRoutes = require("./viewerRoutes");
const tokenRoutes = require("./tokenRoutes");
const userRoutes = require("./userRoutes");
const commonController = require("../middleware/authentication");
const creatorController = require("../controller/creatorController");
const fs = require("fs");

router.use("/viewer/", viewerRoutes);
router.use("/creator/", creatorRoutes);
router.use("/studio/", studioRoutes);
router.use("/token/", tokenRoutes);
router.use("/user/", userRoutes);

router.get("/video", function (req, res) {
  // const range = req.headers.range;
  // if (!range) {
  //   res.status(400).send("Requires Range header");
  // }
  const videoPath = "./tom&jerry.mp4";
  const videoSize = fs.statSync(videoPath).size;
  // console.log("size of video is:", videoSize);
  const CHUNK_SIZE = 10 ** 6; //1 MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

const sendOGVideo = async (req, res) => {
  const { size } = await fileInfo(filename);
  const range = req.headers.range;
  if (range) {
    let [start, end] = range.replace(/bytes=/, "").split("-");
    start = parseInt(start, 10);
    end = end ? parseInt(end, 10) : size - 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": start - end + 1,
      "Content-Type": "video/mp4",
    });

    createReadStream(filename, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": size,
      "Content-Type": "video/mp4",
    });
    createReadStream(filename).pipe(res);
  }
};

router.get("/:error", (req, res) => {
  res.render("error", { status: 404, message: "Not found" });
});

module.exports = router;
