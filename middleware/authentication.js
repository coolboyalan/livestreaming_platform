const jwt = require("jsonwebtoken");
const errorHandler = require("../error");

async function authentication(req, res, next) {
  try {
    const token = req.headers["auth"];
    const user = jwt.verify(token, process.env.JWT);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

async function authorization(req, res, next) {
  try {
    const user = req.user;
    const { category } = user;

    if (category === "admin") return next();

    if (req.originalUrl.match(category)) return next();

    const err = {
      status: 403,
      message: "you ain't allowed to this task",
    };
    errorHandler(err);
  } catch (err) {
    next(err);
  }
}

async function subAdmin(req, res, next) {
  try {
    next();
  } catch (err) {
    next(err);
  }
}
module.exports = { authentication, authorization };
