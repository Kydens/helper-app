const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const authRoute = require("./v1/routes/authRoute");
const usersRoute = require("./v1/routes/usersRoute");

router.use("/auth", authRoute);
router.use("/users", authMiddleware, usersRoute);

module.exports = router;
