const NodeMediaServer = require("node-media-server");
const fs = require("fs");
const http = require("http");
require("dotenv").config()

// Set up Node Media Server
const nmsConfig = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: process.env.NMS_PORT,
    allow_origin: "*",
  },
};

const nms = new NodeMediaServer(nmsConfig);

// Event listeners for Node Media Server
nms.on("preConnect", (id, args) => {
  console.log("[NodeMediaServer] Viewer connected:", id);
});

nms.on("doneConnect", (id) => {
  console.log("[NodeMediaServer] Viewer disconnected:", id);
});

nms.on("postPublish", (id, streamPath, args) => {
  console.log("[NodeMediaServer] Stream published:", streamPath);

  // URL of the image
  const url = `http://localhost:${process.env.NMS_PORT}${streamPath}.flv`;
  
  const streamKey = streamPath.split("/")[2];
  http.get(url, (res) => {
    // Image will be stored at this path
    const path = `./media/videos/${streamKey + new Date()}.flv`;
    const filePath = fs.createWriteStream(path);
    res.pipe(filePath);
    filePath
      .on("finish", () => {
        filePath.close();
        console.log("Download Completed");
      })
      .on("error", (err) => {
        console.log(err);
        console.log("download not supported");
      });
  });

  // Transcode the RTMP stream to HLS

  /* NOT IN USE AS OF NOW

  const hlsOutput = `./public/${streamPath}/stream.m3u8`;
  ffmpeg(`rtmp://localhost/${streamPath}`)
    .addOption("-c:v", "libx264")
    .addOption("-c:a", "aac")
    .addOption("-f", "hls")
    .addOption("-hls_time", "4")
    .addOption("-hls_list_size", "6")
    .addOption(
      "-hls_segment_filename",
      `${hlsOutput.replace(".m3u8", "")}_%03d.ts`
    )
    .output(hlsOutput)
    .on("end", () => {
      console.log("Transcoding finished");
    })
    .on("error", (err) => {
      console.error("ffmpeg error:", err.message);
    })
    .run();

    NOT IN USE AS OF NOW*/
});

nms.on("donePublish", (id, streamPath) => {
  console.log("[NodeMediaServer] Stream unpublished:", streamPath);
});

module.exports = nms;
