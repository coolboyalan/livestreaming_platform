const jwt = require("jsonwebtoken");
const errorHandler = require("../error");
const userController = require("../controller/userController");

async function authenticate(req, res, next) {
  try {
    const { auth: authToken } = req.headers;

    let loggedInUser;
    let user;
    if (authToken) {
      loggedInUser = jwt.verify(authToken, process.env.JWT);
      user = await userController.getUser(loggedInUser.userId);
    }
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
module.exports = { authenticate, authorization };
