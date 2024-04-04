const jwt = require("jsonwebtoken");
const MyError = require("../error");

const authentication = async (req, res, next) => {
  try {
    const token = req.headers["auth"];
    const user = jwt.verify(token, process.env.JWT);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

const authorization = async (req, res, next) => {
  try {
    const user = req.user;
    const { category } = user;

    if (category === "admin") return next();

    if (req.originalUrl.match(category)) return next();

    throw new MyError({
      status: 403,
      message: "you ain't allowed to this task",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { authentication, authorization };
