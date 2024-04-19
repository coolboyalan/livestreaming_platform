const commonController = require("../middleware/authentication");
const creatorController = require("../controller/creatorController");
const User = require("../models/userModel");
const Creator = require("../models/creatorModel");
const Viewer = require("../models/viewerModel");
const Studio = require("../models/studioModel");
const httpStatus = require("http-status");

const app  = require("express");
const router = app.Router();

router.get(["/", "/index.html", "/index", "/home"], homePage);

router.get(
  ["/myprofile.html", "profile", "myprofile.html"],
  allowLogin,
  profile
);
router.get("/profile/:userId", isLoggedIn, profile);

router.route("/login").get(sessionChecker, login).post(loginResponse);
router.get("/creators", creators);
router
  .route("/viewer-signUp")
  .get(sessionChecker, viewerSignup)
  .post(viewerSignupResponse);
router
  .route("/creator-signUp")
  .get(sessionChecker, creatorSignup)
  .post(creatorSignupResponse);

router
  .route("/creator-details-add")
  .get(allowLogin, creatorDetailsPage)
  .post(allowLogin, addCreatorDetails);

router.get("/logout", logout);
router.get("/about", about);
router.get("/creators/categories", categories);
router.get("/contact", contact);
router.get("/tokens", allowLogin, tokensPage);
router.get("/live-creaor/:roomId");


function allowLogin(req, res, next) {
  if (req.session.user && req.cookies.user_id) {
    next();
  } else {
    res.redirect("login");
  }
}

function sessionChecker(req, res, next) {
  if (req.session.user && req.cookies.user_id) {
    res.redirect("index");
  } else {
    next();
  }
}

function isLoggedIn(req, res, next) {
  if (req.session.user && req.cookies.user_id) {
    res.loggedIn = true;
    next();
  } else {
    next();
  }
}

async function profile(req, res, next) {
  try {
    const userId = req.params.userId || req.session.user.userId;
    const user = await User.findByPk(userId);
    let loggedIn = false;
    if (req.session.user) loggedIn = true;
    if (!user) {
      const err = {
        status: 404,
        message: "User not found",
      };
      return next(err);
    }
    const { category } = user;
    const modelId = `${category}Id`;
    if (!modelId || modelId === "viewerId") {
      const err = {
        status: 404,
        message: "User profile has not been updated yet",
      };
      return next(err);
    }
    let id = user[modelId];
    let data;
    if (category === "creator") {
      data = await Creator.findByPk(id);
    } else if (category === "viewer") {
      data = await Viewer.findByPk(id);
    } else if (category === "studio") {
      data = await Studio.findByPk(id);
    }
    if (!data && modelId === "creatorId") {
      return res.redirect("/creator-details-add");
    }
    if (!data) {
      return res.render("index", {
        title: "Creators",
        loggedIn,
      });
    }
    const response = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.taxNo,
      address: data.city,
      loggedIn,
    };
    res.render("profile", response);
  } catch (err) {
    next(err);
  }
}

async function loginResponse(req, res, next) {
  try {
    const userData = req.body;
    delete userData.submit;

    const { category } = userData;
    if (!category) {
    } else {
      req.url = `/${category}/login`;
      req.method = "POST";
      await router.handle(req, res, next);
    }
  } catch (err) {
    next(err);
  }
}

function logout(req, res, next) {
  try {
    if (req.session.user && req.cookies.user_id) {
      res.clearCookie("user_id");
      res.render("index");
    } else {
      res.render("login");
    }
  } catch (err) {
    next(err);
  }
}

async function homePage(req, res, next) {
  try {
    let loggedIn;
    if (req.session.user) loggedIn = true;
    res.render("index", { loggedIn });
  } catch (err) {
    next(err);
  }
}

async function creators(req, res, next) {
  try {
    const creators = await creatorController.getAllCreators();
    let loggedIn;
    if (req.session.user) loggedIn = true;
    res.render("creators", { title: "Creators", creators, loggedIn });
  } catch (err) {
    next(err);
  }
}

async function viewerSignup(req, res, next) {
  try {
    let loggedIn;
    if (req.session.user) loggedIn = true;
    res.render("viewer", { title: "Viewer SignUp", loggedIn });
  } catch (err) {
    next(err);
  }
}

async function viewerSignupResponse(req, res, next) {
  try {
    const userData = req.body;
    delete userData.submit;
    delete userData["confirm-password"];
    console.log(userData, req.body);
    req.url = "/user/viewer/create";
    req.method = "POST";
    await router.handle(req, res, next);
  } catch (err) {
    next(err);
  }
}

async function creatorSignupResponse(req, res, next) {
  try {
    const userData = req.body;
    delete userData.submit;
    delete userData["confirm-password"];
    req.url = "/user/creator/create";
    req.method = "POST";
    await router.handle(req, res, next);
  } catch (err) {
    next(err);
  }
}

async function creatorSignup(req, res, next) {
  try {
    let loggedIn;
    if (req.session.user) loggedIn = true;
    res.render("content-creator", { loggedIn });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    res.render("login");
  } catch (err) {
    next(err);
  }
}

async function creatorDetailsPage(req, res, next) {
  try {
    const userId = req.session.user.userId;
    const user = await User.findByPk(userId);
    let loggedIn;
    if (req.session.user) loggedIn = true;
    if (user.creatorId) {
      return res.redirect("index");
    }

    res.render("creatorDetails", { loggedIn });
  } catch (err) {
    next(err);
  }
}

async function addCreatorDetails(req, res, next) {
  try {
    const userData = req.body;
    delete userData.submit;
    req.url = "/creator/create";
    req.method = "POST";
    await router.handle(req, res, next);
  } catch (err) {
    next(err);
  }
}

async function about(req, res, next) {
  try {
    let loggedIn;
    if (req.session.user) loggedIn = true;
    res.render("about", { title: "About", loggedIn });
  } catch (err) {
    next(err);
  }
}

async function categories(req, res, next) {
  try {
    let loggedIn;
    if (req.session.user) loggedIn = true;
    res.render("categories", { title: "Categories", loggedIn });
  } catch (err) {
    next(err);
  }
}

async function contact(req, res, next) {
  try {
    let loggedIn;
    if (req.session.user) loggedIn = true;
    res.render("contact", { title: "Contact", loggedIn });
  } catch (err) {
    next(err);
  }
}

async function tokensPage(req, res, next) {
  try {
    let loggedIn;
    if (req.session.user) loggedIn = true;
    res.render("tokens", { title: "Tokens", loggedIn });
  } catch (err) {
    next(err);
  }
}
module.exports = router;
