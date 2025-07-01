const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const walletsRoute = require("./v1/routes/walletsRoute");
const todolistRoute = require("./v1/routes/todolistRoute");

router.use("/features/wallets", authMiddleware, walletsRoute);
router.use("/features/todolist", authMiddleware, todolistRoute);

module.exports = router;
