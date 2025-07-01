const express = require("express");
const {
  getAllWallets,
  createWallets,
  updateWallets,
  deleteWallets,
  getWalletsById,
} = require("../controllers/walletsController");
const walletsValidations = require("../validations/walletsValidations");
const router = express.Router();

router.post("/", walletsValidations, createWallets);
router.get("/", getAllWallets);
router.get("/:id", getWalletsById);
router.put("/:id", walletsValidations, updateWallets);
router.delete("/:id", deleteWallets);

module.exports = router;
