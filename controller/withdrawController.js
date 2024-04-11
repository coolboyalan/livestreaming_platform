const errorHandler = require("../error");
const withdrawModel = require("../models/withdrawModel");
const creatorController = require("./creatorController");

async function createWithdraw(withdrawData) {
  try {
    const { creatorId } = withdrawData;
    const existingWithdraw = await withdrawModel.findOne({
      where: {
        creatorId,
        status: "in process",
      },
    });
    if (existingWithdraw) {
      const err = {
        status: 400,
        message: "You already have a withdraw request in process",
      };
      return errorHandler(err);
    }
    const withdraw = await withdrawModel.create(withdrawData);
    return withdraw;
  } catch (err) {
    errorHandler(err);
  }
}

async function updateWithdrawStatus(withdrawId, status) {
  try {
    const withdraw = await withdrawModel.findByPk(withdrawId);
    if (!withdraw) {
      const err = {
        status: 400,
        message: "there is not withdraw request with this id",
      };
      return errorHandler(err);
    }

    if (status === "success") {
      withdraw.status = status;
      await withdraw.save();
      return withdraw.toJSON();
    }

    const { tokenQuantity } = withdraw;

    const { creatorId } = withdraw;
    const internal = true;

    const updateCreator = await creatorController.updateTokens(
      creatorId,
      tokenQuantity,
      internal
    );

    withdraw.status = status;
    await withdraw.save();
    return withdraw.toJSON();
  } catch (err) {
    errorHandler(err);
  }
}

module.exports = { createWithdraw, updateWithdrawStatus };
