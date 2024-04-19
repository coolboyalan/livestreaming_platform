const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const errorHandler = require("../error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function contentCategories() {
  try {
    const categories = await Category.findAll();
    return categories;
  } catch (err) {
    errorHandler(err);
  }
}


async function login(userData, category) {
  try {
    const err = {};
    const { username, password } = userData;
    const data = await User.findOne({ where: { username } });
    let user;
    if (data) {
      user = data.toJSON();
    }
    if (!data || user.category !== category || user.isDeleted) {
      err.status = 404;
      err.message = `There is no ${category} with this username`;
      return err;
    }
    if (user.isSuspended) {
      err.status = 403;
      err.message = `Your ${category} account has been suspended`;
      return err;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      err.status = 401;
      err.message = "Incorrect Password";
      return err;
    }

    const categoryKey = `${category}Id`;
    const categoryValue = user[categoryKey];

    const tokenData = {
      userId: user.id,
      isAdult: user.isAdult,
      category: user.category,
      totalWatchTime: user.totalWatchTime,
      [categoryKey]: categoryValue,
    };

    const token = jwt.sign(tokenData, process.env.JWT, {
      expiresIn: "1d",
    });

    tokenData.token = token;

    return tokenData;
  } catch (err) {
    errorHandler(err);
  }
}

async function authenticate(authToken) {
  try {
    const loggedInUser = jwt.verify(authToken, process.env.JWT);
    return loggedInUser
  } catch (err) {
    errorHandler(err);
  }
}

async function follow(followerId, selectedUserId) {
  try {
    const err = {
      status: 404,
    };

    const follower = await User.findByPk(followerId);
    if (!follower) {
      err.message = "Your account ID is invalid, please contact support";
      return errorHandler(err);
    }
    const selectedUser = await User.findByPk(selectedUserId);
    if (!selectedUser) {
      err.message = "The account you want to follow doesn't exist";
      return errorHandler(err);
    }

    const followers = selectedUser.followers || [];
    followers.push(followerId);

    const following = follower.following || [];
    following.push(selectedUserId);

    await selectedUser.update(followers);
    await follower.update(following);

    return {
      status: true,
      message: "request was successful",
    };
  } catch (err) {
    errorHandler(err);
  }
}

async function unfollow(followerId, selectedUserId) {
  try {
    const err = {
      status: 404,
    };

    const follower = await User.findByPk(followerId);
    if (!follower) {
      err.message = "Your account ID is invalid, please contact support";
      return errorHandler(err);
    }
    const selectedUser = await User.findByPk(selectedUserId);
    if (!selectedUser) {
      err.message = "The account you want to unfollow doesn't exist";
      return errorHandler(err);
    }

    const followers = selectedUser.followers || [];

    const followerIndex = followers.indexOf(followerId);

    if (followerIndex !== -1) {
      followers.splice(followerIndex, 1);
    } else {
      err.message = "You do not follow this account";
    }

    const following = follower.following || [];

    const followingIndex = following.indexOf(followerId);

    if (followingIndex !== -1) {
      following.splice(followingIndex, 1);
    }

    await selectedUser.update(followers);
    await follower.update(following);

    return {
      status: true,
      message: "request was successful",
    };
  } catch (err) {
    errorHandler(err);
  }
}

module.exports = {
  login,
  follow,
  unfollow,
  authenticate,
  contentCategories,
};
