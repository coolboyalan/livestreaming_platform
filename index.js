const express = require("express");
const router = require("./routes/route");
const NodeMediaServer = require("./controller/liveStreamingController");
require("dotenv").config({ path: `./.env` })

const app = express();

NodeMediaServer.run();

app.use(express.json());

app.use("/", router);

app.use((err, req, res, next) => {
  err.status = err.status || 500;
  res.status(err.status).json({
    status: false,
    response: err.response,
    message: err.message,
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
