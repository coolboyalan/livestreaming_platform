const express = require("express");
const router = require("./routes/route");
const NodeMediaServer = require("./controller/liveStreamingController");
const cors = require("cors");
const multer = require("multer");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const frontendManager = require("./controller/frontendController");
const Category = require("./models/categoryModel");
require("dotenv").config({ path: `./.env` });

const app = express();
app.use(cors());
app.use(multer().any());

NodeMediaServer.run();

app.use(express.static("public"));
app.use(express.static("public/assets"));
app.use(express.static("public/assets/bootstrap"));
app.use(express.static("public/assets/bootstrap/css"));
app.use(express.static("public/assets/bootstrap/js"));
app.use(express.static("public/assets/color"));
app.use(express.static("public/assets/css"));
app.use(express.static("public/assets/fonts"));
app.use(express.static("public/assets/images"));
app.use(express.static("public/assets/js"));
app.use(express.static("public/assets/js/bootstrap"));
app.use(express.static("public/assets/js/owlcarousel"));
app.use(express.static("public/assets/owlcarousel/css"));
app.use(express.static("public/assets/owlcarousel/js"));
app.use(express.static("media/photos/creators"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(
  session({
    key: "user_id",
    secret: process.env.SESSION,
    saveUninitialized: true,
    resave: false,
    cookie: {
      expires: 600000,
    },
  })
);
app.use(cookieParser());

app.use("/", async (req, res, next) => {
  try {
    let categories = await Category.findAll();
    categories = categories.map((ele) => {
      return ele.dataValues;
    });
    req.categories = categories;
    next();
  } catch (err) {
    next(err);
  }
});

app.use("/", frontendManager);
app.use("/", router);

app.use((err, req, res, next) => {
  err.status = err.status || 500;
  let loggedIn;
  if (req.session.user) loggedIn = true;
  res.render("error", { status: err.status, message: err.message, loggedIn ,categories:req.categories});
  console.log(err.message || err.error);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
