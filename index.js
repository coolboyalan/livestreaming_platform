const express = require("express");
const router = require("./routes/route");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/", router);

app.use((err, req, res, next) => {
  err.status = err.status || 500;
  res.status(err.status).json({
    status: err.status,
    response: err.response,
    message: err.message,
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
