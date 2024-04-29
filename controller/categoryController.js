const errorHandler = require("../error");
const Category = require("../models/categoryModel");

async function createCategory(categoryName, subCategories) {
  try {
    if (!categoryName || categoryName.trim().length === 0) {
      const err = {
        loc: process.cwd(),
        status: 400,
        message: "Please provide category name",
      };
      return errorHandler(err);
    }

    if (Array.isArray(subCategories)) {
      if (subCategories.length === 0) {
        subCategories.push(categoryName);
      }
    } else {
      subCategories = [subCategories];
    }

    const category = await Category.create({
      name: categoryName,
      subCategories,
    });
    return category;
  } catch (err) {}
}

const category = {
  Educational: [
    "Teaching Classes",
    "Research Guidance",
    "Analytical tools",
    "Q&A",
    "Live Events",
  ],
  "Professional Guidance": ["Counseling", "Legal", "Medical", "Coaching"],
  Entertainment: ["Music", "Comedy", "Sports", "Model"],
  News: ["News", "MainStream Media OutLets", "Reviews"],
  "Social Content": ["Lifestyle", "Smart Dating", "Live Events"],
  "Relegious Content": ["Teachings", "Songs", "Discussions"],
  Skills: [
    "Cooking Episodes",
    "Driving/Riding",
    "Playing Instruments",
    "Talents Display",
  ],
  "Talk Shows": ["Fashion", "Trends"],
  "Fundraising Events": ["Fundraising Events"],
  Celebrities: ["Celebrities"],
};

async function addDefaultCategories() {
  try {
    for (let key in category) {
      const cat = await Category.create({
        name: key,
        subCategories: category[key],
      });
    }
  } catch (err) {
    errorHandler(err);
  }
}

module.exports = {
  addDefaultCategories,
  createCategory,
};
