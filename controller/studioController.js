const errorHandler = require("../error");
const creatorController = require("./creatorController");

async function studioLogin(userData) {
  try {
    const category = "studio";
    const loggedInUser = await commonController.login(userData, category);
    return loggedInUser;
  } catch (err) {
    errorHandler(err);
  }
}

const createCreatorUnderStudio = async (creatorData) => {
  try {
    const studioId = "XYZ"; //TODO:find out a way to implent auth and map correctly;
    creatorData.studioId = studioId;
    creatorData.isStudioAccount = true;
    const creator = await creatorController.createUser(creatorData);
    return creator;
  } catch (err) {
    errorHandler(err);
  }
};


const suspendCreatorAccount = async (creatorId) => {
  try {
    return;
  } catch (err) {}
};

const deleteCreatorAccount = async () => {
  try {
    return;
  } catch (err) {}
};

module.exports = {
  createCreatorUnderStudio,
  studioLogin,
};
